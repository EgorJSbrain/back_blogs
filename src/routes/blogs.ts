import { Router, Request, Response } from 'express'

import { BlogsService } from '../services'
import { HTTP_STATUSES } from '../constants/global'
import {
  RequestWithBody,
  RequestWithParams,
  RequestWithParamsAndBody
} from '../types/global'
import { IBlog } from '../types/blogs'
import { CreateBlogDto } from '../dtos/blogs/create-blog.dto'
import { UpdateBlogDto } from '../dtos/blogs/update-blog.dto'
import { BlogInputFields } from '../constants/blogs'

import {
  FieldValidationError,
  Result,
  ValidationError,
  validationResult
} from 'express-validator'
import { BlogsCreateUpdateValidation, transformErrors } from '../utils/validation/inputValidations'
import { authMiddleware } from '../middlewares'

export const blogsRouter = Router({})

blogsRouter.get('/', async (_: Request, res: Response<IBlog[]>) => {
  const blogs = await BlogsService.getBlogs()

  if (!blogs) {
    return res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
  }

  res.status(HTTP_STATUSES.OK_200).send(blogs)
})

blogsRouter.get(
  '/:id',
  async (req: RequestWithParams<{ id: string }>, res: Response<IBlog>) => {
    const id = req.params.id

    if (!id) {
      return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    }

    const blog = await BlogsService.getBlogById(id)

    if (!blog) {
      return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    }

    res.status(HTTP_STATUSES.OK_200).send(blog)
  }
)

blogsRouter.post(
  '/',
  authMiddleware,
  BlogsCreateUpdateValidation(),
  async (req: RequestWithBody<CreateBlogDto>, res: Response) => {
    const creatingData = {
      [BlogInputFields.name]: req.body.name,
      [BlogInputFields.description]: req.body.description,
      [BlogInputFields.websiteUrl]: req.body.websiteUrl
    }

    const resultValidation: Result<ValidationError> = validationResult(req)

    if (!resultValidation.isEmpty()) {
      return res.status(HTTP_STATUSES.BAD_REQUEST_400).send({
        errorsMessages: transformErrors(resultValidation.array({ onlyFirstError: true }) as FieldValidationError[])
      })
    }

    const blog = await BlogsService.createBlog(creatingData)

    if (!blog) {
      return res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
    }

    res.status(HTTP_STATUSES.CREATED_201).send(blog)
  }
)

blogsRouter.put(
  '/:id',
  authMiddleware,
  BlogsCreateUpdateValidation(),
  async (
    req: RequestWithParamsAndBody<{ id: string }, UpdateBlogDto>,
    res: Response
  ) => {
    const id = req.params.id

    if (!id) {
      return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    }

    const existedBlog = await BlogsService.getBlogById(id)

    if (!existedBlog) {
      return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    }

    const updatedBlog = {
      [BlogInputFields.name]: Object.prototype.hasOwnProperty.call(req.body, BlogInputFields.name)
        ? req.body.name ?? ''
        : existedBlog?.name,
      [BlogInputFields.description]: Object.prototype.hasOwnProperty.call(req.body, BlogInputFields.description)
        ? req.body.description ?? ''
        : existedBlog?.description,
      [BlogInputFields.websiteUrl]: Object.prototype.hasOwnProperty.call(req.body, BlogInputFields.websiteUrl)
        ? req.body.websiteUrl
        : existedBlog?.websiteUrl ?? ''
    }

    const resultValidation: Result<ValidationError> = validationResult(req)

    if (!resultValidation.isEmpty()) {
      return res.status(HTTP_STATUSES.BAD_REQUEST_400).send({
        errorsMessages: transformErrors(resultValidation.array({ onlyFirstError: true }) as FieldValidationError[])
      })
    }

    const blog = await BlogsService.updateBlog(id, updatedBlog)

    if (!blog) {
      return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    }

    res.status(HTTP_STATUSES.NO_CONTENT_204).send(blog)
  }
)

blogsRouter.delete(
  '/:id',
  authMiddleware,
  async (req: RequestWithParams<{ id: string }>, res: Response) => {
    const id = req.params.id

    if (!id) {
      return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    }

    const response = await BlogsService.deleteBlog(id)

    if (!response) {
      return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    }

    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
  }
)
