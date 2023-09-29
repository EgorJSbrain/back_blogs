import { DBfields } from '../db/constants'
import { getCollection } from '../db/mongo-db'
import { generateNewPost } from './utils'

import { IPost } from '../types/posts'
import { CreatePostDto } from '../dtos/posts/create-post.dto'
import { UpdatePostDto } from '../dtos/posts/update-post.dto'

const postsDB = getCollection<IPost>(DBfields.posts)

export const PostsService = {
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

  async createPost(data: CreatePostDto) {
    try {
      let post
      const createdPost = generateNewPost(data)

      const response = await postsDB.insertOne(generateNewPost(data))

      if (response.insertedId) {
        post = await postsDB.findOne({ id: createdPost.id })
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
        post = await postsDB.findOne({ id })
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
