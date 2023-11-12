import { FilterQuery, SortOrder } from 'mongoose'
import { SortDirections } from '../constants/global'
import { Post } from '../models'

import { IPost } from '../types/posts'
import { RequestParams, ResponseBody } from '../types/global'
import { UpdatePostDto } from '../dtos/posts/update-post.dto'

export class PostsRepository {
  async getPosts(params: RequestParams, blogId?: string): Promise<ResponseBody<IPost> | null> {
    try {
      const {
        sortBy = 'createdAt',
        sortDirection = SortDirections.desc,
        pageNumber = 1,
        pageSize = 10
      } = params

      const sort: Record<string, SortOrder> = {}
      let filter: FilterQuery<IPost> = {}

      if (blogId) {
        filter = { blogId }
      }

      if (sortBy && sortDirection) {
        sort[sortBy] = sortDirection === SortDirections.asc ? 1 : -1
      }

      const pageSizeNumber = Number(pageSize)
      const pageNumberNum = Number(pageNumber)
      const skip = (pageNumberNum - 1) * pageSizeNumber
      const count = await Post.countDocuments(filter)
      const pagesCount = Math.ceil(count / pageSizeNumber)

      const posts = await Post
        .find(filter, { _id: 0, __v: 0 })
        .sort(sort)
        .skip(skip)
        .limit(pageSizeNumber)
        .lean()

      return {
        pagesCount,
        page: pageNumberNum,
        pageSize: pageSizeNumber,
        totalCount: count,
        items: posts
      }
    } catch {
      return null
    }
  }

  async getPostById(id: string): Promise<IPost | null> {
    try {
      const post = await Post.findOne({ id }, { _id: 0, __v: 0 })

      return post
    } catch {
      return null
    }
  }

  async createPost(data: IPost): Promise<IPost | null> {
    try {
      let post = null

      const response = await Post.create(data)

      if (response._id) {
        post = await Post.findOne(
          { _id: response._id },
          { _id: 0, __v: 0 }
        )
      }

      return post
    } catch {
      return null
    }
  }

  async updatePost(id: string, data: UpdatePostDto): Promise<IPost | null> {
    try {
      let post = null
      const response = await Post.updateOne({ id }, { $set: data })

      if (response.modifiedCount) {
        post = await Post.findOne({ id }, { _id: 0, __v: 0 })
      }

      return post
    } catch {
      return null
    }
  }

  async deletePost(id: string): Promise<boolean> {
    try {
      const response = await Post.deleteOne({ id })

      return !!response.deletedCount
    } catch {
      return false
    }
  }

  async getPostsByBlogId(
    blogId: string,
    params: RequestParams
  ): Promise<ResponseBody<IPost> | null> {
    try {
      const {
        sortBy = 'createdAt',
        sortDirection = SortDirections.desc,
        pageNumber = 1,
        pageSize = 10
      } = params

      const pageSizeNumber = Number(pageSize)
      const pageNumberNum = Number(pageNumber)
      const skip = (pageNumberNum - 1) * pageSizeNumber
      const count = await Post.countDocuments({ blogId })
      const pagesCount = Math.ceil(count / pageSizeNumber)

      const sort: Record<string, SortOrder> = {}

      if (sortBy && sortDirection) {
        sort[sortBy] = sortDirection === SortDirections.asc ? 1 : -1
      }

      const posts = await Post
        .find({ blogId }, { _id: 0, __v: 0 })
        .sort(sort)
        .skip(skip)
        .limit(pageSizeNumber)
        .lean()

      return {
        pagesCount,
        page: pageNumberNum,
        pageSize: pageSizeNumber,
        totalCount: count,
        items: posts
      }
    } catch {
      return null
    }
  }

  async createPostByBlogId(data: IPost): Promise<IPost | null> {
    try {
      let post = null

      const response = await Post.create(data)

      if (response._id) {
        post = await Post.findOne(
          { _id: response._id },
          { _id: 0, __v: 0 }
        ).lean()
      }

      return post
    } catch {
      return null
    }
  }
}
