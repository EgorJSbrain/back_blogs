import { app } from "../../src/app";
import { HTTP_STATUSES, RouterPaths } from "../../src/constants/global";
import request from 'supertest'
import { CreateBlogDto } from "../../src/dtos/blogs/create-blog.dto";

export const blogsTestManager = {
  async createBlog(
    data: CreateBlogDto,
    expectedStatusCode: HTTP_STATUSES = HTTP_STATUSES.CREATED_201
  ) {
    const response = await request(app)
      .post(RouterPaths.blogs)
      .send(data)
      .expect(expectedStatusCode)

    return {response, entity: response.body}
  }
}