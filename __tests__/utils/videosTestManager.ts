import request from 'supertest'
import { app } from "../../src/app";
import { HTTP_STATUSES, RouterPaths } from "../../src/constants/global";
import { authUser } from "../../src/db/db";
import { CreateVideoDto } from "../../src/dtos/videos/create-video.dto";

export const videosTestManager = {
  async createVideo(
    data: CreateVideoDto,
    expectedStatusCode: HTTP_STATUSES = HTTP_STATUSES.CREATED_201
  ) {
    const response = await request(app)
      .post(RouterPaths.videos)
      .set({ Authorization: `Basic ${authUser.password}` })
      .send(data)
      .expect(expectedStatusCode)

    return {response, entity: response.body}
  }
}