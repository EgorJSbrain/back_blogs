import { Response, Request } from 'express'
import { DevicesService, UsersService } from '../services'
import { HTTP_STATUSES } from '../constants/global'

import { RequestWithBody } from '../types/global'
import { CreateUserDto } from '../dtos/users/create-user.dto'
import { LoginUserDto } from '../dtos/users/login-user.dto'

export class AuthController {
  constructor(
    protected usersService: UsersService,
    protected devicesService: DevicesService
  ) {}

  async login(
    req: RequestWithBody<LoginUserDto>,
    res: Response
  ): Promise<undefined> {
    const ip = req.ip
    const deviceTitle = req.headers['user-agent']

    const user = await this.usersService.checkCredentials(
      req.body.loginOrEmail,
      req.body.password
    )

    if (!user) {
      res.sendStatus(HTTP_STATUSES.NOT_AUTHORIZED_401)
      return
    }

    if (user && !user.emailConfirmation.isConfirmed) {
      res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
      return
    }

    const device = await this.devicesService.createDevice({
      ip,
      title: deviceTitle ?? 'device_title',
      userId: user.accountData.id
    })

    // const accessToken = JwtService.createAccessJWT(user.accountData.id)
    // const refreshToken = JwtService.createRefreshJWT(
    //   device?.userId,
    //   device?.lastActiveDate,
    //   device?.deviceId
    // )

    // res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true })
    // res.status(HTTP_STATUSES.OK_200).send({ accessToken })
  }

  async registration(
    req: RequestWithBody<CreateUserDto>,
    res: Response
  ): Promise<undefined> {
    const user = await this.usersService.createUser(req.body)

    if (!user) {
      res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
      return
    }

    // const responseConfirmMail = await mailService.sendRegistrationConfirmationMail(user)

    // if (!responseConfirmMail) {
    //   res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
    //   return
    // }

    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
  }

  async resendRegistrationEmail(
    req: RequestWithBody<{ email: string }>,
    res: Response
  ): Promise<undefined> {
    const user = await this.usersService.getUserByEmail(req.body.email)

    if (!user) {
      res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
      return
    }

    const updatedUser =
      await this.usersService.updateUserWithNewConfirmatioCode(user)

    if (!updatedUser) {
      res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
      return
    }

    // const responseConfirmMail = await mailService.sendRegistrationConfirmationMail(updatedUser)

    // if (!responseConfirmMail) {
    //   res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
    //   return
    // }

    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
  }

  async confirmRegistration(
    req: RequestWithBody<{ code: string }>,
    res: Response
  ): Promise<undefined> {
    const existedUser = await this.usersService.getUserByVerificationCode(
      req.body.code
    )

    if (!existedUser) {
      res.status(HTTP_STATUSES.BAD_REQUEST_400)
      return
    }

    if (existedUser.emailConfirmation.isConfirmed) {
      res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
      return
    }

    if (
      existedUser &&
      existedUser.emailConfirmation.expirationDate < new Date()
    ) {
      res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
      return
    }

    const user = await this.usersService.confirmUserEmail(existedUser)

    if (!user) {
      res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
      return
    }

    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
  }

  async recoveryPassword(
    req: RequestWithBody<{ email: string }>,
    res: Response
  ): Promise<undefined> {
    const user = await this.usersService.getUserByEmail(req.body.email)

    if (user) {
      const updatedUser =
        await this.usersService.updateUserWithNewRecoveryPasswordCode(user)

      if (!updatedUser) {
        res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
        return
      }

      // await mailService.sendRecoveryPasswordMail(updatedUser)
    }

    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
  }

  async setNewPassword(
    req: RequestWithBody<{ recoveryCode: string, newPassword: string }>,
    res: Response
  ): Promise<undefined> {
    const user = await this.usersService.getUserByRecoveryCode(req.body.recoveryCode)

    if (!user) {
      res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
      return
    }

    await this.usersService.updatePasswordUser(
      user.accountData.id,
      req.body.newPassword
    )

    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
  }

  async getMe(req: RequestWithBody<LoginUserDto>, res: Response): Promise<undefined> {
    const user = await this.usersService.getUserById(req.userId)

    if (!user) {
      res.sendStatus(HTTP_STATUSES.NOT_AUTHORIZED_401)
      return
    }

    res.status(HTTP_STATUSES.OK_200).send({
      userId: user.accountData.id,
      email: user.accountData.email,
      login: user.accountData.login
    })
  }

  async refreshToken(req: Request, res: Response): Promise<undefined> {
    const token = req.cookies.refreshToken

    if (!token) {
      res.sendStatus(HTTP_STATUSES.NOT_AUTHORIZED_401)
      return
    }

    if (!req.headers) {
      res.sendStatus(HTTP_STATUSES.NOT_AUTHORIZED_401)
      return
    }

    // const userId = await JwtService.verifyExperationToken(token)

    // if (!userId) {
    //   res.sendStatus(HTTP_STATUSES.NOT_AUTHORIZED_401)
    //   return
    // }

    const existedToken = await this.devicesService.getDevice(token)

    if (!existedToken) {
      res.sendStatus(HTTP_STATUSES.NOT_AUTHORIZED_401)
      return
    }

    const updatedToken = await this.devicesService.updateDevice(existedToken.lastActiveDate)

    if (!updatedToken) {
      res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
      return
    }

    const tokens = await JwtService.refreshTokens(
      updatedToken.userId,
      updatedToken.deviceId,
      updatedToken.lastActiveDate
    )

    if (!tokens) {
      res.clearCookie('refreshToken')
      res.sendStatus(HTTP_STATUSES.NOT_AUTHORIZED_401)
      return
    }

    res.cookie('refreshToken', tokens.refreshToken, { httpOnly: true, secure: true })
    res.status(HTTP_STATUSES.OK_200).send({ accessToken: tokens.accessToken })
  }

  async logout(req: Request, res: Response): Promise<undefined> {
    const token = req.cookies.refreshToken

    if (!token) {
      res.sendStatus(HTTP_STATUSES.NOT_AUTHORIZED_401)
      return
    }

    if (!req.headers) {
      res.sendStatus(HTTP_STATUSES.NOT_AUTHORIZED_401)
      return
    }

    const userId = await JwtService.verifyExperationToken(token)

    if (!userId) {
      res.sendStatus(HTTP_STATUSES.NOT_AUTHORIZED_401)
      return
    }

    const deviceToken = await this.devicesService.getDevice(token)

    if (!deviceToken) {
      res.sendStatus(HTTP_STATUSES.NOT_AUTHORIZED_401)
      return
    }

    await this.devicesService.deleteDevice(deviceToken.deviceId)

    res.clearCookie('refreshToken')
    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
  }
}
