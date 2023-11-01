import { Response } from 'express'
import { UsersService } from '../services'
import { RequestParams, RequestWithBody, RequestWithParams, ResponseBody } from '../types/global'

import { HTTP_STATUSES } from '../constants/global'
import { IUserAccountData } from '../types/users'
import { CreateUserDto } from '../dtos/users/create-user.dto'

export class UsersController {
  constructor(protected usersService: UsersService) {}

  async getUsers(
    req: RequestWithParams<RequestParams>,
    res: Response<ResponseBody<IUserAccountData>>
  ): Promise<undefined> {
    const users = await this.usersService.getUsers(req.query)

    if (!users) {
      res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
      return
    }

    res.status(HTTP_STATUSES.OK_200).send(users)
  }

  async createUser (req: RequestWithBody<CreateUserDto>, res: Response): Promise<undefined> {
    const existedUser = await this.usersService.getUserByLoginOrEmail(req.body.email, req.body.login)

    if (existedUser) {
      res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
      return
    }

    const user = await this.usersService.createUser(req.body, true)

    if (!user) {
      res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
      return
    }

    res.status(HTTP_STATUSES.CREATED_201).send({
      id: user.accountData.id,
      email: user.accountData.email,
      login: user.accountData.login,
      createdAt: user.accountData.createdAt
    })
  }

  async deleteUser(req: RequestWithParams<{ id: string }>, res: Response): Promise<undefined> {
    const { id } = req.params

    if (!id) {
      res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
      return
    }

    const response = await this.usersService.deleteUser(id)

    if (!response) {
      res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
      return
    }

    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
  }
}
