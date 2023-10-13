import { generateNewPost } from './utils'
import { PostsRepository } from '../repositories'
import { PostInputFields } from '../constants/posts'

import { CreatePostDto } from '../dtos/posts/create-post.dto'
import { UpdatePostDto } from '../dtos/posts/update-post.dto'
import { RequestParams } from '../types/global'
import { IBlog } from '../types/blogs'

export const PostsService = {
  async getPosts(params: RequestParams) {
    return await PostsRepository.getPosts(params)
  },

  async getPostById(id: string) {
    return await PostsRepository.getPostById(id)
  },

  async createPost(data: CreatePostDto, blog: IBlog) {
    const { title, shortDescription, content, blogId } = data

    const creatingData = {
      [PostInputFields.title]: title,
      [PostInputFields.shortDescription]: shortDescription,
      [PostInputFields.content]: content,
      [PostInputFields.blogId]: blogId,
      [PostInputFields.blogName]: blog?.name ?? ''
    }

    const createdPost = generateNewPost(creatingData)

    return await PostsRepository.createPost(createdPost)
  },

  async updatePost(id: string, data: UpdatePostDto) {
    return await PostsRepository.updatePost(id, data)
  },

  async deletePost(id: string) {
    return await PostsRepository.deletePost(id)
  }
}
