import { Router, Response } from 'express'

import { BlogsService } from '../services'
import { HTTP_STATUSES } from '../constants/global'
import { BlogInputFields } from '../constants/blogs'
import { validationMiddleware, authMiddleware } from '../middlewares'

import {
  RequestParams,
  RequestWithBody,
  RequestWithParams,
  RequestWithParamsAndBody,
  RequestWithParamsAndQuery,
  ResponseBody
} from '../types/global'
import { BlogPostsRequestParams, BlogsRequestParams, IBlog } from '../types/blogs'
import { CreateBlogDto } from '../dtos/blogs/create-blog.dto'
import { UpdateBlogDto } from '../dtos/blogs/update-blog.dto'

import {
  BlogsCreateUpdateValidation,
  PostCreateByBlogIdValidation
} from '../utils/validation/inputValidations'
import { IPost } from '../types/posts'
import { CreatePostDto } from '../dtos/posts/create-post.dto'

export const blogsRouter = Router({})

blogsRouter.get(
  '/',
  async (req: RequestWithParams<BlogsRequestParams>, res: Response<ResponseBody<IBlog>>) => {
    const blogs = await BlogsService.getBlogs(req.query)

    if (!blogs) {
      return res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
    }

    res.status(HTTP_STATUSES.OK_200).send(blogs)
  }
)

blogsRouter.get(
  '/:id',
  async (req: RequestWithParams<{ id: string }>, res: Response<IBlog>) => {
    const { id } = req.params

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
  validationMiddleware,
  async (req: RequestWithBody<CreateBlogDto>, res: Response) => {
    const blog = await BlogsService.createBlog(req.body)

    if (!blog) {
      return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    }

    res.status(HTTP_STATUSES.CREATED_201).send(blog)
  }
)

blogsRouter.put(
  '/:id',
  authMiddleware,
  BlogsCreateUpdateValidation(),
  validationMiddleware,
  async (
    req: RequestWithParamsAndBody<{ id: string }, UpdateBlogDto>,
    res: Response
  ) => {
    const { id } = req.params
    const { name, description, websiteUrl } = req.body

    if (!id) {
      return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    }

    const existedBlog = await BlogsService.getBlogById(id)

    if (!existedBlog) {
      return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    }

    const updatedBlog = {
      [BlogInputFields.name]: Object.prototype.hasOwnProperty.call(req.body, BlogInputFields.name)
        ? name ?? ''
        : existedBlog?.name,
      [BlogInputFields.description]: Object.prototype.hasOwnProperty.call(req.body, BlogInputFields.description)
        ? description ?? ''
        : existedBlog?.description,
      [BlogInputFields.websiteUrl]: Object.prototype.hasOwnProperty.call(req.body, BlogInputFields.websiteUrl)
        ? websiteUrl
        : existedBlog?.websiteUrl ?? ''
    }

    const blog = await BlogsService.updateBlog(id, updatedBlog)

    if (!blog) {
      return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    }

    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
  }
)

blogsRouter.delete(
  '/:id',
  authMiddleware,
  async (req: RequestWithParams<{ id: string }>, res: Response) => {
    const { id } = req.params

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

blogsRouter.get(
  '/:blogId/posts',
  async (req: RequestWithParamsAndQuery<BlogPostsRequestParams, RequestParams>, res: Response<ResponseBody<IPost>>) => {
    const { blogId } = req.params

    if (!blogId) {
      return res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
    }

    const existedBlog = await BlogsService.getBlogById(blogId)

    if (!existedBlog) {
      return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    }

    const posts = await BlogsService.getPostsByBlogId(blogId, req.query)

    if (!posts) {
      return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    }

    res.status(HTTP_STATUSES.OK_200).send(posts)
  }
)

blogsRouter.post(
  '/:blogId/posts',
  authMiddleware,
  PostCreateByBlogIdValidation(),
  validationMiddleware,
  async (
    req: RequestWithParamsAndBody<{ blogId: string }, CreatePostDto>,
    res: Response<IPost>
  ) => {
    const { blogId } = req.params

    if (!blogId) {
      return res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
    }

    const existedBlog = await BlogsService.getBlogById(blogId)

    if (!existedBlog) {
      return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    }

    const post = await BlogsService.createPostByBlogId(req.body, existedBlog)

    if (!post) {
      return res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
    }

    res.status(HTTP_STATUSES.CREATED_201).send(post)
  }
)
