import request, { Response } from 'supertest'
import { generateApp } from "../../src/app";
import { HTTP_STATUSES, RouterPaths } from "../../src/constants/global";
import { authUser } from "../../src/db/db";
import { CreateVideoDto } from "../../src/dtos/videos/create-video.dto";
import { IVideo } from '../../src/types/videos';

export const videosTestManager = {
  async createVideo(
    data: CreateVideoDto,
    expectedStatusCode: HTTP_STATUSES = HTTP_STATUSES.CREATED_201
  ): Promise<{response: Response, entity: IVideo}>   {
    const response = await request(generateApp())
      .post(RouterPaths.videos)
      .set({ Authorization: `Basic ${authUser.password}` })
      .send(data)
      .expect(expectedStatusCode)

    return {response, entity: response.body}
  }
}