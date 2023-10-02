import { generateNewBlog } from './utils'
import { BlogsRepository, PostsRepository } from '../repositories'

import { CreateBlogDto } from '../dtos/blogs/create-blog.dto'
import { UpdateBlogDto } from '../dtos/blogs/update-blog.dto'
import { BlogPostsRequestParams, BlogsRequestParams } from '../types/blogs'

export const BlogsService = {
  async getBlogs(params: BlogsRequestParams) {
    return await BlogsRepository.getBlogs(params)
  },

  async getBlogById(id: string) {
    return await BlogsRepository.getBlogById(id)
  },

  async createBlog(data: CreateBlogDto) {
    const createdBlog = generateNewBlog(data)

    return await BlogsRepository.createBlog(createdBlog)
  },

  async updateBlog(id: string, data: UpdateBlogDto) {
    return await BlogsRepository.updateBlog(id, data)
  },

  async deleteBlog(id: string) {
    return await BlogsRepository.deleteBlog(id)
  },

  async getPostsByBlogId(params: BlogPostsRequestParams) {
    return await PostsRepository.getPostsByBlogId(params)
  }
}
