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
      const blogs = await blogsDB.find({}, { projection: { _id: false } }).toArray()

      return blogs || []
    } catch {
      return []
    }
  },

  async getBlogById(id: string) {
    try {
      const blog = await blogsDB.findOne({ id }, { projection: { _id: false } })

      return blog
    } catch {
      return null
    }
  },

  async createBlog(data: CreateBlogDto) {
    try {
      let blog = null
      const createdBlog = generateNewBlog(data)

      const response = await blogsDB.insertOne(createdBlog)

      if (response.insertedId && createdBlog.id) {
        blog = await blogsDB.findOne({ id: createdBlog.id }, { projection: { _id: 0 } })
      }
      console.log("----!------service", blog)

      return blog
    } catch {
      return null
    }
  },

  async updateBlog(id: string, data: UpdateBlogDto) {
    try {
      let blog

      const response = await blogsDB.updateOne({ id }, { $set: data })

      if (response.modifiedCount) {
        blog = await blogsDB.findOne({ id }, { projection: { _id: 0 } })
      }

      return blog
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
