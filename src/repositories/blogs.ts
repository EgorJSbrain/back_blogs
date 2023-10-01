import { DBfields } from '../db/constants'
import { getCollection } from '../db/mongo-db'

import { IBlog } from '../types/blogs'
import { UpdateBlogDto } from '../dtos/blogs/update-blog.dto'

const blogsDB = getCollection<IBlog>(DBfields.blogs)

export const BlogsRepository = {
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

  async createBlog(data: IBlog) {
    try {
      let blog = null

      const response = await blogsDB.insertOne(data)

      if (response.insertedId && data.id) {
        blog = await blogsDB.findOne({ id: data.id }, { projection: { _id: 0 } })
      }

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
