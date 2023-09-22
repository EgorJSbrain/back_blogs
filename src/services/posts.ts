import { DBfields } from '../db/constants'
import { db } from '../db/db'
import { generateNewPost } from './utils'
import { IPost } from '../types/posts'
import { CreatePostDto } from '../dtos/posts/create-post.dto'
import { UpdatePostDto } from '../dtos/posts/update-post.dto'

export const PostsService = {
  async getPosts() {
    try {
      if (!db<IPost>().posts) {
        return []
      }

      const posts = db<IPost>().posts

      return posts || []
    } catch {
      return []
    }
  },

  async getPostById(id: string) {
    try {
      if (!db<IPost>().posts) {
        return null
      }

      const post = db<IPost>().posts.find((item) => item.id === id)

      return post
    } catch {
      return null
    }
  },

  async createPost(data: CreatePostDto) {
    try {
      const createdPost = generateNewPost(data)

      const existedposts = db<IPost>().posts

      if (!existedposts) {
        db(DBfields.posts)
      }

      db<IPost>().posts.push(createdPost)

      return createdPost
    } catch {
      return null
    }
  },

  async updatePost(id: string, data: UpdatePostDto) {
    try {
      if (!db<IPost>().posts) {
        return null
      }

      const post = db<IPost>().posts.find((item) => item.id === id)

      if (!post) {
        return null
      }

      const updatedPost = {
        ...post,
        ...data
      }

      const updatedPosts = db<IPost>().posts.map((post) => {
        if (post.id === id) {
          return updatedPost
        } else {
          return post
        }
      })

      db<IPost>().posts = updatedPosts

      return updatedPost
    } catch {
      return null
    }
  },

  async deletePost(id: string) {
    try {
      if (!db<IPost>().posts) {
        return null
      }

      const existedPost = db<IPost>().posts.find((item) => item.id === id)

      if (!existedPost) {
        return null
      }

      const posts = db<IPost>().posts.filter((item) => item.id !== id)

      db<IPost>().posts = posts

      return true
    } catch {
      return null
    }
  }
}
