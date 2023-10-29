import { Router, Response, Request } from 'express'

import { TokensService, UsersService } from '../services'
import { mailService } from '../domain/mail-service'
import {
  EmailValidation,
  RegistrationConfirmValidation,
  UserCreateValidation,
  UserEmailValidation,
  UserLoginValidation
} from '../utils/validation/inputValidations'
import { validationMiddleware } from '../middlewares'
import { HTTP_STATUSES } from '../constants/global'
import { authJWTMiddleware } from '../middlewares/authJWTMiddleware'
import { JwtService } from '../applications/jwt-service'

import { RequestWithBody } from '../types/global'
import { LoginUserDto } from '../dtos/users/login-user.dto'
import { CreateUserDto } from '../dtos/users/create-user.dto'

export const authRouter = Router({})

authRouter.post(
  '/login',
  UserLoginValidation(),
  validationMiddleware,
  async (req: RequestWithBody<LoginUserDto>, res: Response) => {
    const ip = req.ip
    const deviceTitle = req.headers['user-agent']

    const user = await UsersService.checkCredentials(req.body.loginOrEmail, req.body.password)

    if (!user) {
      return res.sendStatus(HTTP_STATUSES.NOT_AUTHORIZED_401)
    }

    if (user && !user.emailConfirmation.isConfirmed) {
      return res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
    }

    const refreshTokenData = await TokensService.createRefreshToken({
      ip,
      title: deviceTitle ?? 'device_title',
      userId: user.accountData.id
    })
    const accessToken = JwtService.createAccessJWT(user.accountData.id)
    const refreshToken = JwtService.createRefreshJWT(
      refreshTokenData.userId,
      refreshTokenData.lastActiveDate,
      refreshTokenData.deviceId
    )

    res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true })
    res.status(HTTP_STATUSES.OK_200).send({ accessToken })
  }
)

authRouter.post(
  '/registration',
  UserCreateValidation(),
  validationMiddleware,
  async (req: RequestWithBody<CreateUserDto>, res: Response) => {
    const user = await UsersService.createUser(req.body)

    if (!user) {
      return res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
    }

    const responseConfirmMail = await mailService.sendRegistrationConfirmationMail(user.accountData.email)

    if (!responseConfirmMail) {
      return res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
    }

    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
  }
)

authRouter.post(
  '/registration-email-resending',
  UserEmailValidation(),
  validationMiddleware,
  async (req: RequestWithBody<{ email: string }>, res: Response) => {
    const user = await UsersService.getUserByEmail(req.body.email)

    if (!user) {
      return res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
    }

    if (user) {
      await UsersService.generateNewCode(user)
    }

    const responseConfirmMail =
      await mailService.sendRegistrationConfirmationMail(user.accountData.email)

    if (!responseConfirmMail) {
      return res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
    }

    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
  }
)

authRouter.post(
  '/registration-confirmation',
  RegistrationConfirmValidation(),
  validationMiddleware,
  async (req: RequestWithBody<{ code: string }>, res: Response) => {
    const existedUser = await UsersService.getUserByVerificationCode(req.body.code)

    if (!existedUser) {
      return res.status(HTTP_STATUSES.BAD_REQUEST_400)
    }

    if (existedUser && existedUser.emailConfirmation.isConfirmed) {
      return res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
    }

    if (existedUser && existedUser.emailConfirmation.expirationDate < new Date()) {
      return res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
    }

    const user = await UsersService.confirmUserEmail(existedUser)

    if (!user) {
      return res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
    }

    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
  }
)

authRouter.post(
  '/password-recovery',
  EmailValidation(),
  validationMiddleware,
  async (req: RequestWithBody<{ email: string }>, res: Response) => {
    const user = await UsersService.getUserByEmail(req.body.email)

    if (!user) {
      return res.status(HTTP_STATUSES.BAD_REQUEST_400)
    }

    if (user) {
      await UsersService.generateNewRecoveryPasswordCode(user)
    }

    const responseConfirmMail =
      await mailService.sendRecoveryPasswordMail(user.accountData.email)

    if (!responseConfirmMail) {
      return res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
    }

    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
  }
)

authRouter.post(
  '/new-password',
  async (req: RequestWithBody<{ recoveryCode: string, newPassword: string }>, res: Response) => {
    const user = await UsersService.getUserByRecoveryCode(req.body.recoveryCode)

    if (!user) {
      return res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
    }

    if (user) {
      await UsersService.updatePasswordUser(user.accountData.id, req.body.newPassword)
    }

    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
  }
)

authRouter.get(
  '/me',
  authJWTMiddleware,
  async (req: RequestWithBody<LoginUserDto>, res: Response) => {
    const user = await UsersService.getUserById(req.userId)

    if (!user) {
      return res.sendStatus(HTTP_STATUSES.NOT_AUTHORIZED_401)
    }

    res.status(HTTP_STATUSES.OK_200).send({
      userId: user.accountData.id,
      email: user.accountData.email,
      login: user.accountData.login
    })
  }
)

authRouter.post(
  '/refresh-token',
  async (req: Request, res: Response) => {
    const token = req.cookies.refreshToken

    if (!token) {
      return res.sendStatus(HTTP_STATUSES.NOT_AUTHORIZED_401)
    }

    if (!req.headers) {
      return res.sendStatus(HTTP_STATUSES.NOT_AUTHORIZED_401)
    }

    const userId = await JwtService.verifyExperationToken(token)

    if (!userId) {
      return res.sendStatus(HTTP_STATUSES.NOT_AUTHORIZED_401)
    }

    const existedToken = await TokensService.getToken(token)

    if (!existedToken) {
      return res.sendStatus(HTTP_STATUSES.NOT_AUTHORIZED_401)
    }

    const updatedToken = await TokensService.updateRefreshToken(existedToken.lastActiveDate)

    if (!updatedToken) {
      return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    }

    const tokens = await JwtService.refreshTokens(
      updatedToken.userId,
      updatedToken.deviceId,
      updatedToken.lastActiveDate
    )

    if (!tokens) {
      res.clearCookie('refreshToken')
      return res.sendStatus(HTTP_STATUSES.NOT_AUTHORIZED_401)
    }

    res.cookie('refreshToken', tokens.refreshToken, { httpOnly: true, secure: true })
    res.status(HTTP_STATUSES.OK_200).send({ accessToken: tokens.accessToken })
  }
)

authRouter.post(
  '/logout',
  async (req: Request, res: Response) => {
    const token = req.cookies.refreshToken

    if (!token) {
      return res.sendStatus(HTTP_STATUSES.NOT_AUTHORIZED_401)
    }

    if (!req.headers) {
      return res.sendStatus(HTTP_STATUSES.NOT_AUTHORIZED_401)
    }

    const userId = await JwtService.verifyExperationToken(token)

    if (!userId) {
      return res.sendStatus(HTTP_STATUSES.NOT_AUTHORIZED_401)
    }

    const deviceToken = await TokensService.getToken(token)

    if (!deviceToken) {
      return res.sendStatus(HTTP_STATUSES.NOT_AUTHORIZED_401)
    }

    await TokensService.deleteRefreshToken(deviceToken.deviceId)

    res.clearCookie('refreshToken')
    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
  }
)
