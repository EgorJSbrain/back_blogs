import request, { Response } from 'supertest'
import { generateApp } from "../../src/app";
import { HTTP_STATUSES, RouterPaths } from "../../src/constants/global";
import { CreateBlogDto } from "../../src/dtos/blogs/create-blog.dto";
import { authUser } from "../../src/db/db";
import { IBlog } from '../../src/types/blogs';

export const blogsTestManager = {
  async createBlog(
    data: CreateBlogDto,
    expectedStatusCode: HTTP_STATUSES = HTTP_STATUSES.CREATED_201
  ): Promise<{ response: Response, entity: IBlog}> {
    const response = await request(generateApp())
      .post(RouterPaths.blogs)
      .set({ Authorization: `Basic ${authUser.password}` })
      .send(data)
      .expect(expectedStatusCode)

    return {response, entity: response.body}
  },
  async getBlogById(
    blogId: string,
    expectedStatusCode: HTTP_STATUSES = HTTP_STATUSES.OK_200
  ): Promise<{ response: Response, entity: IBlog}> {
    const response = await request(generateApp())
      .get(`${RouterPaths.blogs}/${blogId}`)
      .expect(expectedStatusCode)

    return {response, entity: response.body}
  }
}