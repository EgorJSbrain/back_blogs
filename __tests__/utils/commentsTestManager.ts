import request, { Response,  } from 'supertest'
import { app } from "../../src/app";
import { HTTP_STATUSES, RouterPaths } from "../../src/constants/global";
import { IPost } from '../../src/types/posts';
import { postsTestManager } from './postsTestManager';
import { usersTestManager } from './usersTestManager';
import { authTestManager } from './authTestManager';
import { CreateCommentDto } from '../../src/dtos/comments/create-comment.dto';
import { IComment } from '../../src/types/comments';

export const commetnsTestManager = {
  async createComment(
    data: CreateCommentDto,
    expectedStatusCode: HTTP_STATUSES = HTTP_STATUSES.CREATED_201,
  ): Promise<{response: Response, entity: IComment, post: IPost, token: { accessToken: string }}> {
    const creatingPostData = {
      title: 'title',
      content: 'test content',
      shortDescription: 'test description',
    }

    const creatingUserData = {
      login: 'uer156',
      email: 'some@some.com',
      password: '123456'
    }

    const loginData = {
      loginOrEmail: 'uer156',
      password: '123456'
    }

    const { entity: post } = await postsTestManager.createPost(creatingPostData, HTTP_STATUSES.CREATED_201)
    await usersTestManager.createUser(creatingUserData, HTTP_STATUSES.CREATED_201)
    const { entity: token } = await authTestManager.login(loginData, {}, HTTP_STATUSES.OK_200)

    const response = await request(app)
      .post(`${RouterPaths.posts}/${post.id}/comments`)
      .set({ Authorization: `Bearer ${token.accessToken}` })
      .send(data)
      .expect(expectedStatusCode)

    return {response, entity: response.body, post, token }
  }
}