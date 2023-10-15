import request, { Response } from 'supertest'
import { app } from "../../src/app";
import { HTTP_STATUSES, RouterPaths } from '../../src/constants/global'
import { IUser } from '../../src/types/users';
import { LoginUserDto } from '../../src/dtos/users/login-user.dto';

export const authTestManager = {
  async login(
    data: LoginUserDto,
    expectedStatusCode: HTTP_STATUSES = HTTP_STATUSES.CREATED_201
  ): Promise<{response: Response, entity: { accessToken: string }}>   {
    const response = await request(app)
      .post(`${RouterPaths.auth}/login`)
      .send(data)
      .expect(expectedStatusCode)

    return {response, entity: response.body}
  }
}