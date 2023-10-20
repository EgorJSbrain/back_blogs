import request, { Response } from 'supertest'
import { app } from "../../src/app";
import { HTTP_STATUSES, RouterPaths } from '../../src/constants/global'
import { IUser } from '../../src/types/users';
import { LoginUserDto } from '../../src/dtos/users/login-user.dto';
import { UsersService } from '../../src/services';
import { CreateUserDto } from '../../src/dtos/users/create-user.dto';

export const authTestManager = {
  async registration(
    data: CreateUserDto,
    expectedStatusCode: HTTP_STATUSES = HTTP_STATUSES.NO_CONTENT_204
  ): Promise<{response: Response, entity: boolean}>   {
    const response = await request(app)
      .post(`${RouterPaths.auth}/registration`)
      .send(data)
      .expect(expectedStatusCode)

    return {response, entity: response.body}
  },
  async login(
    data: LoginUserDto,
    expectedStatusCode: HTTP_STATUSES = HTTP_STATUSES.CREATED_201
  ): Promise<{response: Response, entity: { accessToken: string }}> {
    const response = await request(app)
      .post(`${RouterPaths.auth}/login`)
      .send(data)
      .expect(expectedStatusCode)

    return {response, entity: response.body}
  }
}