import { DBfields } from '../db/constants'
import { getCollection } from '../db/mongo-db'

import { IPost } from '../types/posts'
import { UpdatePostDto } from '../dtos/posts/update-post.dto'

const postsDB = getCollection<IPost>(DBfields.posts)

export const PostsRepository = {
  async getPosts() {
    try {
      const posts = await postsDB.find({}, { projection: { _id: 0 } }).toArray()

      return posts || []
    } catch {
      return []
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
        post = await postsDB.findOne({ id: data.id }, { projection: { _id: 0 } })
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
  }
}
