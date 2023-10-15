import { Router, Response } from 'express'

import { UsersService } from '../services'
import { UserCreateValidation } from '../utils/validation/inputValidations'
import { authMiddleware, validationMiddleware } from '../middlewares'
import { HTTP_STATUSES } from '../constants/global'
import {
  RequestParams,
  RequestWithBody,
  RequestWithParams,
  ResponseBody
} from '../types/global'
import { CreateUserDto } from '../dtos/users/create-user.dto'
import { IUser } from '../types/users'

export const usersRouter = Router({})

usersRouter.get(
  '/',
  async (req: RequestWithParams<RequestParams>, res: Response<ResponseBody<IUser>>) => {
    const users = await UsersService.getUsers(req.query)

    if (!users) {
      return res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
    }

    res.status(HTTP_STATUSES.OK_200).send(users)
  }
)

usersRouter.post(
  '/',
  authMiddleware,
  UserCreateValidation(),
  validationMiddleware,
  async (req: RequestWithBody<CreateUserDto>, res: Response) => {
    const existedUser = await UsersService.getUserByLoginOrEmail(req.body.login, req.body.email)

    if (existedUser) {
      return res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
    }

    const user = await UsersService.createUser(req.body, true)

    if (!user) {
      return res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
    }

    res.status(HTTP_STATUSES.CREATED_201).send({
      id: user.accountData.id,
      email: user.accountData.email,
      login: user.accountData.login,
      createdAt: user.accountData.createdAt
    })
  }
)

usersRouter.delete(
  '/:id',
  authMiddleware,
  async (req: RequestWithParams<{ id: string }>, res: Response) => {
    const { id } = req.params

    if (!id) {
      return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    }

    const response = await UsersService.deleteUser(id)

    if (!response) {
      return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    }

    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
  }
)
