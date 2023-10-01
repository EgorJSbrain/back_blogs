import { generateNewBlog } from './utils'
import { BlogsRepository } from '../repositories'

import { CreateBlogDto } from '../dtos/blogs/create-blog.dto'
import { UpdateBlogDto } from '../dtos/blogs/update-blog.dto'

export const BlogsService = {
  async getBlogs() {
    return await BlogsRepository.getBlogs()
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
  }
}
