import { Router, Response } from 'express'

import { BlogsService, CommentsService, PostsService, UsersService } from '../services'
import { CommentsValidation, PostsCreateUpdateValidation } from '../utils/validation/inputValidations'
import { authMiddleware, validationMiddleware } from '../middlewares'
import { PostInputFields } from '../constants/posts'
import { HTTP_STATUSES } from '../constants/global'
import {
  RequestParams,
  RequestWithBody,
  RequestWithParams,
  RequestWithParamsAndBody,
  ResponseBody
} from '../types/global'
import { IPost } from '../types/posts'
import { CreatePostDto } from '../dtos/posts/create-post.dto'
import { UpdatePostDto } from '../dtos/posts/update-post.dto'
import { CommentsRequestParams } from '../types/comments'
import { CreateCommentDto } from '../dtos/comments/create-comment.dto'
import { authJWTMiddleware } from '../middlewares/authJWTMiddleware'

export const postsRouter = Router({})

postsRouter.get(
  '/',
  async (req: RequestWithParams<RequestParams>, res: Response<ResponseBody<IPost>>) => {
    const posts = await PostsService.getPosts(req.query)

    if (!posts) {
      return res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
    }

    res.status(HTTP_STATUSES.OK_200).send(posts)
  }
)

postsRouter.get(
  '/:id',
  async (req: RequestWithParams<{ id: string }>, res: Response<IPost>) => {
    const { id } = req.params

    if (!id) {
      return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    }

    const blog = await PostsService.getPostById(id)

    if (!blog) {
      return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    }

    res.status(HTTP_STATUSES.OK_200).send(blog)
  }
)

postsRouter.post(
  '/',
  authMiddleware,
  PostsCreateUpdateValidation(),
  validationMiddleware,
  async (req: RequestWithBody<CreatePostDto>, res: Response) => {
    const existedBlog = await BlogsService.getBlogById(req.body.blogId)

    if (!existedBlog) {
      return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    }

    const blog = await PostsService.createPost(req.body, existedBlog)

    if (!blog) {
      return res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
    }

    res.status(HTTP_STATUSES.CREATED_201).send(blog)
  }
)

postsRouter.put(
  '/:id',
  authMiddleware,
  PostsCreateUpdateValidation(),
  validationMiddleware,
  async (
    req: RequestWithParamsAndBody<{ id: string }, UpdatePostDto>,
    res: Response
  ) => {
    const { id } = req.params
    const { title, content, blogId, shortDescription } = req.body

    if (!id) {
      return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    }

    const existedPost = await PostsService.getPostById(id)

    if (!existedPost) {
      return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    }

    const updatedPost = {
      [PostInputFields.title]: PostInputFields.title in req.body
        ? title
        : existedPost?.title,
      [PostInputFields.content]: PostInputFields.content in req.body
        ? content
        : existedPost?.content,
      [PostInputFields.shortDescription]: PostInputFields.shortDescription in req.body
        ? shortDescription
        : existedPost?.shortDescription,
      [PostInputFields.blogId]: PostInputFields.blogId in req.body
        ? blogId
        : existedPost?.blogId
    }

    const post = await PostsService.updatePost(id, updatedPost)

    if (!post) {
      return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    }

    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
  }
)

postsRouter.delete(
  '/:id',
  authMiddleware,
  async (req: RequestWithParams<{ id: string }>, res: Response) => {
    const { id } = req.params

    if (!id) {
      return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    }

    const response = await PostsService.deletePost(id)

    if (!response) {
      return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    }

    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
  }
)

postsRouter.get(
  '/:postId/comments',
  async (req: RequestWithParams<CommentsRequestParams>, res: Response) => {
    const { postId } = req.params

    if (!postId) {
      return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    }

    const response = await CommentsService.getCommentsByPostId(req.query)

    if (!response) {
      return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    }

    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
  }
)

postsRouter.post(
  '/:postId/comments',
  authJWTMiddleware,
  CommentsValidation(),
  validationMiddleware,
  async (req: RequestWithParamsAndBody<{ postId: string }, CreateCommentDto>, res: Response) => {
    const { postId } = req.params
    const existedUser = await UsersService.getUserById(req.userId)

    if (!existedUser) {
      return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    }

    if (!postId) {
      return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    }

    const response = await CommentsService.createComment(req.body, existedUser)

    if (!response) {
      return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    }

    res.status(HTTP_STATUSES.CREATED_201).send(response)
  }
)
