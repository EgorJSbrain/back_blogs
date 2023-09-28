import { DBfields } from '../db/constants'
import { getCollection } from '../db/mongo-db'
import { generateNewBlog } from './utils'

import { IBlog } from '../types/blogs'
import { CreateBlogDto } from '../dtos/blogs/create-blog.dto'
import { UpdateBlogDto } from '../dtos/blogs/update-blog.dto'

const blogsDB = getCollection<IBlog>(DBfields.blogs)

export const BlogsService = {
  async getBlogs() {
    try {
      const blogs = await blogsDB.find({}).toArray()

      return blogs || []
    } catch {
      return []
    }
  },

  async getBlogById(id: string) {
    try {
      const blog = await blogsDB.findOne({ id })

      return blog
    } catch {
      return null
    }
  },

  async createBlog(data: CreateBlogDto) {
    try {
      const createdBlog = generateNewBlog(data)

      await blogsDB.insertOne(createdBlog)

      return createdBlog
    } catch {
      return null
    }
  },

  async updateBlog(id: string, data: UpdateBlogDto) {
    try {
      const response = await blogsDB.updateOne({ id }, { $set: data })

      return !!response.modifiedCount
    } catch {
      return null
    }
  },

  async deleteBlog(id: string) {
    try {
      const response = await blogsDB.deleteOne({ id })

      return !!response.deletedCount
    } catch {
      return null
    }
  }
}
