import { DBfields } from '../db/constants'
import { getCollection } from '../db/mongo-db'

import { BlogsRequestParams, IBlog } from '../types/blogs'
import { UpdateBlogDto } from '../dtos/blogs/update-blog.dto'
import { SortDirections } from '../constants/global'
import { ResponseBody } from '../types/global'

const blogsDB = getCollection<IBlog>(DBfields.blogs)

export const BlogsRepository = {
  async getBlogs(params: BlogsRequestParams): Promise<ResponseBody<IBlog> | null> {
    try {
      const {
        searchNameTerm,
        sortBy = 'createdAt',
        sortDirection = SortDirections.desc,
        pageNumber = 1,
        pageSize = 10
      } = params
      const filter: any = {}
      const sort: any = {}

      if (searchNameTerm) {
        filter.name = { $regex: searchNameTerm, $options: 'i' }
      }

      if (sortBy && sortDirection) {
        sort[sortBy] = sortDirection === SortDirections.asc ? 1 : -1
      }

      const skip = (pageNumber - 1) * pageSize
      const count = await blogsDB.estimatedDocumentCount()
      const pagesCount = Math.ceil(count / pageSize)

      const blogs = await blogsDB
        .find(filter, { projection: { _id: false } })
        .sort(sort)
        .skip(skip)
        .limit(Number(pageSize))
        .toArray()

      return {
        pagesCount,
        page: pageNumber,
        pageSize,
        totalCount: count,
        items: blogs
      }
    } catch {
      return null
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
