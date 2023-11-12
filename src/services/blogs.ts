import { BlogsRepository } from '../repositories'

import { CreateBlogDto } from '../dtos/blogs/create-blog.dto'
import { UpdateBlogDto } from '../dtos/blogs/update-blog.dto'
import { Blog, IBlog } from '../types/blogs'
import { RequestParams, ResponseBody } from '../types/global'
import { CommentsRequestParams } from '../types/comments'
import { IPost } from '../types/posts'
import { PostsService } from './posts'

export class BlogsService {
  constructor(
    protected blogsRepository: BlogsRepository,
    protected postsService: PostsService
  ) {}

  async getBlogs(
    params: CommentsRequestParams
  ): Promise<ResponseBody<IBlog> | null> {
    return await this.blogsRepository.getBlogs(params)
  }

  async getBlogById(id: string): Promise<IBlog | null> {
    return await this.blogsRepository.getBlogById(id)
  }

  async createBlog(data: CreateBlogDto): Promise<IBlog | null> {
    const { name, description, websiteUrl } = data
    const createdBlog = new Blog(name, description, websiteUrl)

    return await this.blogsRepository.createBlog(createdBlog)
  }

  async updateBlog(id: string, data: UpdateBlogDto): Promise<IBlog | null> {
    return await this.blogsRepository.updateBlog(id, data)
  }

  async deleteBlog(id: string): Promise<boolean> {
    return await this.blogsRepository.deleteBlog(id)
  }

  async getPostsByBlogId(
    blogId: string,
    params: RequestParams,
    userId: string | null
  ): Promise<ResponseBody<IPost> | null> {
    return await this.postsService.getPosts(params, userId, blogId)
  }
}
