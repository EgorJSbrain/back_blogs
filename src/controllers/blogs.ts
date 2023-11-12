import { Response } from 'express'
import { BlogsService, PostsService } from '../services'
import {
  RequestParams,
  RequestWithBody,
  RequestWithParams,
  RequestWithParamsAndBody,
  RequestWithParamsAndQuery,
  ResponseBody
} from '../types/global'

import { HTTP_STATUSES } from '../constants/global'
import { BlogPostsRequestParams, BlogsRequestParams, IBlog } from '../types/blogs'
import { CreateBlogDto } from '../dtos/blogs/create-blog.dto'
import { UpdateBlogDto } from '../dtos/blogs/update-blog.dto'
import { BlogInputFields } from '../constants/blogs'
import { IPost } from '../types/posts'
import { CreatePostDto } from '../dtos/posts/create-post.dto'
import { JwtService } from '../applications/jwt-service'

export class BlogsController {
  constructor(
    protected blogsService: BlogsService,
    protected postsService: PostsService,
    protected jwtService: JwtService
  ) {}

  async getBlogs(
    req: RequestWithParams<BlogsRequestParams>,
    res: Response<ResponseBody<IBlog>>
  ): Promise<undefined> {
    const blogs = await this.blogsService.getBlogs(req.query)

    if (!blogs) {
      res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
      return
    }

    res.status(HTTP_STATUSES.OK_200).send(blogs)
  }

  async getBlogById(
    req: RequestWithParams<{ id: string }>,
    res: Response<IBlog>
  ): Promise<undefined> {
    const { id } = req.params

    if (!id) {
      res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
      return
    }

    const blog = await this.blogsService.getBlogById(id)

    if (!blog) {
      res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
      return
    }

    res.status(HTTP_STATUSES.OK_200).send(blog)
  }

  async createBlog(
    req: RequestWithBody<CreateBlogDto>,
    res: Response
  ): Promise<undefined> {
    const blog = await this.blogsService.createBlog(req.body)

    if (!blog) {
      res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
      return
    }

    res.status(HTTP_STATUSES.CREATED_201).send(blog)
  }

  async updateBlog(
    req: RequestWithParamsAndBody<{ id: string }, UpdateBlogDto>,
    res: Response
  ): Promise<undefined> {
    const { id } = req.params
    const { name, description, websiteUrl } = req.body

    if (!id) {
      res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
      return
    }

    const existedBlog = await this.blogsService.getBlogById(id)

    if (!existedBlog) {
      res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
      return
    }

    const updatedBlog = {
      [BlogInputFields.name]: Object.prototype.hasOwnProperty.call(
        req.body,
        BlogInputFields.name
      )
        ? name ?? ''
        : existedBlog?.name,
      [BlogInputFields.description]: Object.prototype.hasOwnProperty.call(
        req.body,
        BlogInputFields.description
      )
        ? description ?? ''
        : existedBlog?.description,
      [BlogInputFields.websiteUrl]: Object.prototype.hasOwnProperty.call(
        req.body,
        BlogInputFields.websiteUrl
      )
        ? websiteUrl
        : existedBlog?.websiteUrl ?? ''
    }

    const blog = await this.blogsService.updateBlog(id, updatedBlog)

    if (!blog) {
      res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
      return
    }

    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
  }

  async deleteBlog(
    req: RequestWithParams<{ id: string }>,
    res: Response
  ): Promise<undefined> {
    const { id } = req.params

    if (!id) {
      res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
      return
    }

    const response = await this.blogsService.deleteBlog(id)

    if (!response) {
      res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
      return
    }

    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
  }

  async getPostsByBlogId(
    req: RequestWithParamsAndQuery<BlogPostsRequestParams, RequestParams>,
    res: Response<ResponseBody<IPost>>
  ): Promise<undefined> {
    const { blogId } = req.params
    let userId: string | null = null

    if (!blogId) {
      res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
      return
    }

    const existedBlog = await this.blogsService.getBlogById(blogId)

    if (!existedBlog) {
      res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
      return
    }

    if (req.headers.authorization) {
      const token = req.headers.authorization.split(' ')[1]
      userId = await this.jwtService.verifyExperationToken(token)
    }

    const posts = await this.blogsService.getPostsByBlogId(blogId, req.query, userId)

    if (!posts) {
      res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
      return
    }

    res.status(HTTP_STATUSES.OK_200).send(posts)
  }

  async creatPostByBlogId (
    req: RequestWithParamsAndBody<{ blogId: string }, CreatePostDto>,
    res: Response<IPost>
  ): Promise<undefined> {
    const { blogId } = req.params

    if (!blogId) {
      res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
    }

    const existedBlog = await this.blogsService.getBlogById(blogId)

    if (!existedBlog) {
      console.log('1')
      res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
      return
    }

    const post = await this.postsService.createPost(req.body, existedBlog)

    if (!post) {
      console.log('2')
      res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
      return
    }

    res.status(HTTP_STATUSES.CREATED_201).send(post)
  }
}
