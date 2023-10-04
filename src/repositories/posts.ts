import { DBfields } from '../db/constants'
import { getCollection } from '../db/mongo-db'

import { IPost } from '../types/posts'
import { UpdatePostDto } from '../dtos/posts/update-post.dto'
import { RequestParams, ResponseBody } from '../types/global'
import { SortDirections } from '../constants/global'
import { BlogPostsRequestParams } from '../types/blogs'

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

      const sort: any = {}

      if (sortBy && sortDirection) {
        sort[sortBy] = sortDirection === SortDirections.asc ? 1 : -1
      }

      const skip = (pageNumber - 1) * pageSize
      const count = await postsDB.estimatedDocumentCount()
      const pagesCount = Math.ceil(count / pageSize)

      const posts = await postsDB
        .find({}, { projection: { _id: false } })
        .sort(sort)
        .skip(skip)
        .limit(Number(pageSize))
        .toArray()

      return {
        pagesCount,
        page: pageNumber,
        pageSize,
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
    params: BlogPostsRequestParams
  ): Promise<ResponseBody<IPost> | null> {
    try {
      const {
        blogId,
        sortBy = 'createdAt',
        sortDirection = SortDirections.asc,
        pageNumber = 1,
        pageSize = 10
      } = params

      const skip = (pageNumber - 1) * pageSize
      const count = await postsDB.countDocuments({ blogId })
      const pagesCount = Math.ceil(count / pageSize)

      const sort: any = {}

      if (sortBy && sortDirection) {
        sort[sortBy] = sortDirection === SortDirections.asc ? 1 : -1
      }

      const posts = await postsDB
        .find({ blogId }, { projection: { _id: false } })
        .sort(sort)
        .skip(skip)
        .limit(Number(pageSize))
        .toArray()

      return {
        pagesCount,
        page: pageNumber,
        pageSize,
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
