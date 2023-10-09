import { Router, Response } from 'express'

import { UsersService } from '../services'
import { UserLoginValidation } from '../utils/validation/inputValidations'
import { validationMiddleware } from '../middlewares'
import { HTTP_STATUSES } from '../constants/global'
import { RequestWithBody } from '../types/global'
import { LoginUserDto } from '../dtos/users/login-user.dto'

export const authRouter = Router({})

authRouter.post(
  '/login',
  UserLoginValidation(),
  validationMiddleware,
  async (req: RequestWithBody<LoginUserDto>, res: Response) => {
    const existedUser = await UsersService.loginUser(req.body.loginOrEmail, req.body.password)

    if (!existedUser) {
      return res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
    }

    res.sendStatus(HTTP_STATUSES.OK_200)
  }
)
