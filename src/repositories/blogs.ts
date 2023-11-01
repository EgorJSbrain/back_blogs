import { FilterQuery, SortOrder } from 'mongoose'

import { BlogsRequestParams, IBlog } from '../types/blogs'
import { UpdateBlogDto } from '../dtos/blogs/update-blog.dto'
import { SortDirections } from '../constants/global'
import { ResponseBody } from '../types/global'
import { Blog } from '../models'

export class BlogsRepository {
  async getBlogs(params: BlogsRequestParams): Promise<ResponseBody<IBlog> | null> {
    try {
      const {
        searchNameTerm,
        sortBy = 'createdAt',
        sortDirection = SortDirections.desc,
        pageNumber = 1,
        pageSize = 10
      } = params

      const filter: FilterQuery<IBlog> = {}
      const sort: Record<string, SortOrder> = {}

      if (searchNameTerm) {
        filter.name = { $regex: searchNameTerm, $options: 'i' }
      }

      if (sortBy && sortDirection) {
        sort[sortBy] = sortDirection === SortDirections.asc ? 1 : -1
      }

      const pageSizeNumber = Number(pageSize)
      const pageNumberNum = Number(pageNumber)
      const skip = (pageNumberNum - 1) * pageSizeNumber
      const count = await Blog.countDocuments(filter)
      const pagesCount = Math.ceil(count / pageSizeNumber)

      const blogs = await Blog
        .find(filter, { projection: { _id: 0 } })
        .sort(sort)
        .skip(skip)
        .limit(pageSizeNumber)
        .lean()

      return {
        pagesCount,
        page: pageNumberNum,
        pageSize: pageSizeNumber,
        totalCount: count,
        items: blogs
      }
    } catch {
      return null
    }
  }

  async getBlogById(id: string): Promise<IBlog | null> {
    try {
      const blog = await Blog.findOne({ id }, { projection: { _id: false } })

      return blog
    } catch {
      return null
    }
  }

  async createBlog(data: IBlog): Promise<IBlog | null> {
    try {
      const response = await Blog.create(data)

      return response
    } catch {
      return null
    }
  }

  async updateBlog(id: string, data: UpdateBlogDto): Promise<IBlog | null> {
    try {
      let blog = null

      const response = await Blog.updateOne({ id }, { $set: data })

      if (response.modifiedCount) {
        blog = await Blog.findOne({ id }, { projection: { _id: 0 } })
      }

      return blog
    } catch {
      return null
    }
  }

  async deleteBlog(id: string): Promise<boolean> {
    try {
      const response = await Blog.deleteOne({ id })

      return !!response.deletedCount
    } catch {
      return false
    }
  }
}
