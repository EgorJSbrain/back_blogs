import { DBfields } from '../db/constants'
import { getCollection } from '../db/mongo-db'
import { SortDirections } from '../constants/global'

import { IPost } from '../types/posts'
import { RequestParams, ResponseBody } from '../types/global'
import { UpdatePostDto } from '../dtos/posts/update-post.dto'
import { Sort } from 'mongodb'

const postsDB = getCollection<IPost>(DBfields.posts)

export const PostsRepository = {
  async getPosts(params: RequestParams): Promise<ResponseBody<IPost> | null> {
    try {
      const {
        sortBy = 'createdAt',
        sortDirection = SortDirections.desc,
        pageNumber = 1,
        pageSize = 10
      } = params
      console.log("!!posts!!!params:", params)

      const sort: Sort = {}

      if (sortBy && sortDirection) {
        sort[sortBy] = sortDirection === SortDirections.asc ? 1 : -1
      }

      const pageSizeNumber = Number(pageSize)
      const pageNumberNum = Number(pageNumber)
      const skip = (pageNumberNum - 1) * pageSizeNumber
      const count = await postsDB.estimatedDocumentCount()
      const pagesCount = Math.ceil(count / pageSizeNumber)

      const posts = await postsDB
        .find({}, { projection: { _id: false } })
        .sort(sort)
        .skip(skip)
        .limit(pageSizeNumber)
        .toArray()

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
  },

  async getPostById(id: string) {
    try {
      const post = await postsDB.findOne({ id }, { projection: { _id: 0 } })

      return post
    } catch {
      return null
    }
  },

  async createPost(data: IPost) {
    try {
      let post

      const response = await postsDB.insertOne(data)

      if (response.insertedId) {
        post = await postsDB.findOne(
          { id: data.id },
          { projection: { _id: 0 } }
        )
      }

      return post
    } catch {
      return null
    }
  },

  async updatePost(id: string, data: UpdatePostDto) {
    try {
      let post
      const response = await postsDB.updateOne({ id }, { $set: data })

      if (response.modifiedCount) {
        post = await postsDB.findOne({ id }, { projection: { _id: 0 } })
      }

      return post
    } catch {
      return null
    }
  },

  async deletePost(id: string) {
    try {
      const response = await postsDB.deleteOne({ id })

      return !!response.deletedCount
    } catch {
      return null
    }
  },

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
      const count = await postsDB.countDocuments({ blogId })
      const pagesCount = Math.ceil(count / pageSizeNumber)

      const sort: Sort = {}

      if (sortBy && sortDirection) {
        sort[sortBy] = sortDirection === SortDirections.asc ? 1 : -1
      }

      const posts = await postsDB
        .find({ blogId }, { projection: { _id: false } })
        .sort(sort)
        .skip(skip)
        .limit(pageSizeNumber)
        .toArray()

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
  },

  async createPostByBlogId(data: IPost) {
    try {
      let post

      const response = await postsDB.insertOne(data)

      if (response.insertedId) {
        post = await postsDB.findOne(
          { id: data.id },
          { projection: { _id: 0 } }
        )
      }

      return post
    } catch {
      return null
    }
  }
}
