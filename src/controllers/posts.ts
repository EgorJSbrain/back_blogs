import { Response } from 'express'
import { BlogsService, CommentsService, PostsService, UsersService } from '../services'
import {
  RequestParams,
  RequestWithBody,
  RequestWithParams,
  RequestWithParamsAndBody,
  ResponseBody
} from '../types/global'

import { HTTP_STATUSES } from '../constants/global'
import { IPost } from '../types/posts'
import { CreatePostDto } from '../dtos/posts/create-post.dto'
import { UpdatePostDto } from '../dtos/posts/update-post.dto'
import { PostInputFields } from '../constants/posts'
import { CommentsRequestParams } from '../types/comments'
import { CreateCommentDto } from '../dtos/comments/create-comment.dto'

export class PostsController {
  constructor(
    protected postsService: PostsService,
    protected blogsService: BlogsService,
    protected commentsService: CommentsService,
    protected usersService: UsersService
  ) {}

  async getPosts(
    req: RequestWithParams<RequestParams>,
    res: Response<ResponseBody<IPost>>
  ): Promise<undefined> {
    const posts = await this.postsService.getPosts(req.query)

    if (!posts) {
      res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
      return
    }

    res.status(HTTP_STATUSES.OK_200).send(posts)
  }

  async getPostById(
    req: RequestWithParams<{ id: string }>,
    res: Response<IPost>
  ): Promise<undefined> {
    const { id } = req.params

    if (!id) {
      res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
      return
    }

    const blog = await this.postsService.getPostById(id)

    if (!blog) {
      res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
      return
    }

    res.status(HTTP_STATUSES.OK_200).send(blog)
  }

  async createPost(
    req: RequestWithBody<CreatePostDto>,
    res: Response
  ): Promise<undefined> {
    const existedBlog = await this.blogsService.getBlogById(req.body.blogId)

    if (!existedBlog) {
      res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
      return
    }

    const blog = await this.postsService.createPost(req.body, existedBlog)

    if (!blog) {
      res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
      return
    }

    res.status(HTTP_STATUSES.CREATED_201).send(blog)
  }

  async updatePost(
    req: RequestWithParamsAndBody<{ id: string }, UpdatePostDto>,
    res: Response
  ): Promise<undefined> {
    const { id } = req.params
    const { title, content, blogId, shortDescription } = req.body

    if (!id) {
      res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
      return
    }

    const existedPost = await this.postsService.getPostById(id)

    if (!existedPost) {
      res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
      return
    }

    const updatedPost = {
      [PostInputFields.title]:
        PostInputFields.title in req.body ? title : existedPost?.title,
      [PostInputFields.content]:
        PostInputFields.content in req.body ? content : existedPost?.content,
      [PostInputFields.shortDescription]:
        PostInputFields.shortDescription in req.body
          ? shortDescription
          : existedPost?.shortDescription,
      [PostInputFields.blogId]:
        PostInputFields.blogId in req.body ? blogId : existedPost?.blogId
    }

    const post = await this.postsService.updatePost(id, updatedPost)

    if (!post) {
      res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
      return
    }

    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
  }

  async deletePost(
    req: RequestWithParams<{ id: string }>,
    res: Response
  ): Promise<undefined> {
    const { id } = req.params

    if (!id) {
      res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
      return
    }

    const response = await this.postsService.deletePost(id)

    if (!response) {
      res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
      return
    }

    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
  }

  async getCommentsByPostId(
    req: RequestWithParams<CommentsRequestParams>,
    res: Response
  ): Promise<undefined> {
    const { postId } = req.params

    if (!postId) {
      res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
      return
    }

    const existedPost = await this.postsService.getPostById(postId)

    if (!existedPost) {
      res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
      return
    }

    const response = await this.commentsService.getCommentsByPostId(
      req.query,
      existedPost.id
    )

    if (!response) {
      res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
      return
    }

    res.status(HTTP_STATUSES.OK_200).send(response)
  }

  async createComment(
    req: RequestWithParamsAndBody<{ postId: string }, CreateCommentDto>,
    res: Response
  ): Promise<undefined> {
    const { postId } = req.params
    const existedUser = await this.usersService.getUserById(req.userId)

    if (!existedUser) {
      res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
      return
    }

    if (!postId) {
      res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
      return
    }

    const existedPost = await this.postsService.getPostById(postId)

    if (!existedPost) {
      res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
      return
    }

    const response = await this.commentsService.createComment(
      req.body,
      existedUser,
      postId
    )

    if (!response) {
      res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
      return
    }

    res.status(HTTP_STATUSES.CREATED_201).send(response)
  }
}