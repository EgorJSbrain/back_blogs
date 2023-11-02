import { PostsRepository } from '../repositories'

import { CreatePostDto } from '../dtos/posts/create-post.dto'
import { UpdatePostDto } from '../dtos/posts/update-post.dto'
import { RequestParams, ResponseBody } from '../types/global'
import { IBlog } from '../types/blogs'
import { IPost, Post } from '../types/posts'

export class PostsService {
  constructor(protected postsRepository: PostsRepository) {}

  async getPosts(params: RequestParams): Promise<ResponseBody<IPost> | null> {
    return await this.postsRepository.getPosts(params)
  }

  async getPostById(id: string): Promise<IPost | null> {
    return await this.postsRepository.getPostById(id)
  }

  async createPost(data: CreatePostDto, blog: IBlog): Promise<IPost | null> {
    const post = new Post(data, blog?.name ?? '')
    return await this.postsRepository.createPost(post)
  }

  async updatePost(id: string, data: UpdatePostDto): Promise<IPost | null> {
    return await this.postsRepository.updatePost(id, data)
  }

  async deletePost(id: string): Promise<boolean> {
    return await this.postsRepository.deletePost(id)
  }
}
