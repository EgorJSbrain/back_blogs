import { Router, Response } from 'express'

import { UsersService } from '../services'
import { UserLoginValidation } from '../utils/validation/inputValidations'
import { validationMiddleware } from '../middlewares'
import { HTTP_STATUSES } from '../constants/global'
import { RequestWithBody } from '../types/global'
import { LoginUserDto } from '../dtos/users/login-user.dto'
import { JwtService } from '../applications/jwt-service'
import { authJWTMiddleware } from '../middlewares/authJWTMiddleware'

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

    res.status(HTTP_STATUSES.OK_200).send(token)
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
      userId: existedUser.id,
      email: existedUser.email,
      login: existedUser.login
    }

    res.status(HTTP_STATUSES.OK_200).send(user)
  }
)
