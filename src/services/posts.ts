import { generateNewPost } from './utils'

import { CreatePostDto } from '../dtos/posts/create-post.dto'
import { UpdatePostDto } from '../dtos/posts/update-post.dto'
import { PostsRepository } from '../repositories'

export const PostsService = {
  async getPosts() {
    return await PostsRepository.getPosts()
  },

  async getPostById(id: string) {
    return await PostsRepository.getPostById(id)
  },

  async createPost(data: CreatePostDto) {
    const createdPost = generateNewPost(data)

    return await PostsRepository.createPost(createdPost)
  },

  async updatePost(id: string, data: UpdatePostDto) {
    return await PostsRepository.updatePost(id, data)
  },

  async deletePost(id: string) {
    return await PostsRepository.deletePost(id)
  }
}
