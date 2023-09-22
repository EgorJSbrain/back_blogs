import { Router, Request, Response } from 'express'
import {
  FieldValidationError,
  Result,
  ValidationError,
  validationResult
} from 'express-validator'

import { BlogsService, PostsService } from '../services'
import { PostsCreateUpdateValidation, transformErrors } from '../utils/validation/inputValidations'
import { authMiddleware } from '../middlewares'
import { PostInputFields } from '../constants/posts'
import { HTTP_STATUSES } from '../constants/global'
import {
  RequestWithBody,
  RequestWithParams,
  RequestWithParamsAndBody
} from '../types/global'
import { IPost } from '../types/posts'
import { CreatePostDto } from '../dtos/posts/create-post.dto'
import { UpdatePostDto } from '../dtos/posts/update-post.dto'

export const postsRouter = Router({})

postsRouter.get('/', async (_: Request, res: Response<IPost[]>) => {
  const posts = await PostsService.getPosts()

  if (!posts) {
    return res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
  }

  res.status(HTTP_STATUSES.OK_200).send(posts)
})

postsRouter.get(
  '/:id',
  async (req: RequestWithParams<{ id: string }>, res: Response<IPost>) => {
    const id = req.params.id

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
  // authMiddleware,
  PostsCreateUpdateValidation(),
  async (req: RequestWithBody<CreatePostDto>, res: Response) => {
    const { title, shortDescription, content, blogId } = req.body

    if (!blogId) {
      return res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
    }

    const existedBlog = await BlogsService.getBlogById(blogId)

    if (!existedBlog) {
      return res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
    }

    const creatingData = {
      [PostInputFields.title]: title,
      [PostInputFields.shortDescription]: shortDescription,
      [PostInputFields.content]: content,
      [PostInputFields.blogId]: blogId,
      [PostInputFields.blogName]: existedBlog.name
    }

    const resultValidation: Result<ValidationError> = validationResult(req)

    if (!resultValidation.isEmpty()) {
      return res.status(HTTP_STATUSES.BAD_REQUEST_400).send({
        errorsMessages: transformErrors(resultValidation.array({ onlyFirstError: true }) as FieldValidationError[])
      })
    }

    const blog = await PostsService.createPost(creatingData)

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
  async (
    req: RequestWithParamsAndBody<{ id: string }, UpdatePostDto>,
    res: Response
  ) => {
    const id = req.params.id
    const { title, content, blogId, shortDescription } = req.body

    if (!id) {
      return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    }

    const existedBlog = await PostsService.getPostById(id)

    if (!existedBlog) {
      return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    }

    const updatedPost = {
      [PostInputFields.title]: PostInputFields.title in req.body
        ? title ?? ''
        : existedBlog?.title,
      [PostInputFields.content]: PostInputFields.content in req.body
        ? content ?? ''
        : existedBlog?.content,
      [PostInputFields.shortDescription]: PostInputFields.shortDescription in req.body
        ? shortDescription
        : existedBlog?.shortDescription ?? '',
      [PostInputFields.blogId]: PostInputFields.blogId in req.body
        ? blogId
        : existedBlog?.blogId ?? ''
    }

    const resultValidation: Result<ValidationError> = validationResult(req)

    if (!resultValidation.isEmpty()) {
      return res.status(HTTP_STATUSES.BAD_REQUEST_400).send({
        errorsMessages: transformErrors(resultValidation.array({ onlyFirstError: true }) as FieldValidationError[])
      })
    }

    const blog = await PostsService.updatePost(id, updatedPost)

    if (!blog) {
      return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    }

    res.status(HTTP_STATUSES.NO_CONTENT_204).send(blog)
  }
)

postsRouter.delete(
  '/:id',
  authMiddleware,
  async (req: RequestWithParams<{ id: string }>, res: Response) => {
    const id = req.params.id

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
