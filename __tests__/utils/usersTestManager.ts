import request, { Response } from 'supertest'
import { generateApp } from "../../src/app";
import { HTTP_STATUSES, RouterPaths } from '../../src/constants/global'
import { CreateUserDto } from '../../src/dtos/users/create-user.dto';
import { IUser, IUserAccountData } from '../../src/types/users';
import { authUser } from '../../src/db/db';
import { UsersService } from '../../src/services';

export const usersTestManager = {
  async createUser(
    data: CreateUserDto,
    expectedStatusCode: HTTP_STATUSES = HTTP_STATUSES.CREATED_201
  ): Promise<{response: Response, entity: IUserAccountData}>   {
    const response = await request(generateApp())
      .post(RouterPaths.users)
      .set({ Authorization: `Basic ${authUser.password}` })
      .send(data)
      .expect(expectedStatusCode)

    return {response, entity: response.body}
  },
  async getUserByEmail(
    email: string,
  ): Promise<IUser | null>   {
    const existedUser = await UsersService.getUserByEmail(email)

    return existedUser
  }
}