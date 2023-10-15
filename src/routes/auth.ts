import { Router, Response } from 'express'

import { UsersService } from '../services'
import { UserCreateValidation, UserLoginValidation } from '../utils/validation/inputValidations'
import { validationMiddleware } from '../middlewares'
import { HTTP_STATUSES } from '../constants/global'
import { RequestWithBody } from '../types/global'
import { LoginUserDto } from '../dtos/users/login-user.dto'
import { JwtService } from '../applications/jwt-service'
import { authJWTMiddleware } from '../middlewares/authJWTMiddleware'
import { CreateUserDto } from '../dtos/users/create-user.dto'
import { mailService } from '../domain/mail-service'

export const authRouter = Router({})

authRouter.post(
  '/login',
  UserLoginValidation(),
  validationMiddleware,
  async (req: RequestWithBody<LoginUserDto>, res: Response) => {
    const user = await UsersService.checkCredentials(req.body.loginOrEmail, req.body.password)

    if (!user) {
      return res.sendStatus(HTTP_STATUSES.NOT_AUTHORIZED_401)
    }

    const token = JwtService.createJWT(user)

    res.status(HTTP_STATUSES.OK_200).send({ accessToken: token })
  }
)

authRouter.post(
  '/registration',
  UserCreateValidation(),
  validationMiddleware,
  async (req: RequestWithBody<CreateUserDto>, res: Response) => {
    const existedUser = await UsersService.getUserByLoginOrEmail(req.body.login, req.body.email)

    if (existedUser) {
      return res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
    }

    const user = await UsersService.createUser(req.body)

    if (!user) {
      return res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
    }

    const responseConfirmMail = await mailService.sendRegistrationConfirmationMail(req.body.login, req.body.email)

    if (!responseConfirmMail) {
      return res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
    }

    res.sendStatus(HTTP_STATUSES.OK_200)
  }
)

authRouter.get(
  '/me',
  authJWTMiddleware,
  async (req: RequestWithBody<LoginUserDto>, res: Response) => {
    const existedUser = await UsersService.getUserById(req.userId)

    if (!existedUser) {
      return res.sendStatus(HTTP_STATUSES.NOT_AUTHORIZED_401)
    }

    const user = {
      userId: existedUser.accountData.id,
      email: existedUser.accountData.email,
      login: existedUser.accountData.login
    }

    res.status(HTTP_STATUSES.OK_200).send(user)
  }
)
