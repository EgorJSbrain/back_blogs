import { app } from "../../src/app";
import { HTTP_STATUSES, RouterPaths } from "../../src/constants/global";
import { CreateVideoDto } from "../../src/dtos/videos/create-video.dto";
import request from 'supertest'

export const videosTestManager = {
  async createVideo(
    data: CreateVideoDto,
    expectedStatusCode: HTTP_STATUSES = HTTP_STATUSES.CREATED_201
  ) {
    const response = await request(app)
      .post(RouterPaths.videos)
      .send(data)
      .expect(expectedStatusCode)

    return {response, entity: response.body}
  }
}