import request, { Response,  } from 'supertest'
import { generateApp } from "../../src/app";
import { HTTP_STATUSES, RouterPaths } from "../../src/constants/global";
import { CreatePostDto } from "../../src/dtos/posts/create-post.dto";
import { authUser } from "../../src/db/db";
import { IPost } from '../../src/types/posts';
import { blogsTestManager } from './blogsTestManager';

export const postsTestManager = {
  async createPost(
    data: Record<string, string>,
    expectedStatusCode: HTTP_STATUSES = HTTP_STATUSES.CREATED_201
  ): Promise<{response: Response, entity: IPost}> {
    const blogData = { name: 'some name', description: 'author name', websiteUrl: 'https://www.google.pl/?hl=pl' }
    const { entity: createdBlog } = await blogsTestManager.createBlog(blogData, HTTP_STATUSES.CREATED_201)
    const { entity: foundBlog } = await blogsTestManager.getBlogById(createdBlog.id)

    const creatingData = {
      blogId: foundBlog.id,
      blogName: foundBlog.name,
      ...data
    }

    const response = await request(generateApp())
      .post(RouterPaths.posts)
      .set({ Authorization: `Basic ${authUser.password}` })
      .send(creatingData)
      .expect(expectedStatusCode)

    return {response, entity: response.body}
  }
}