import { PostsRepository } from '../repositories'
import { LikesService } from './likes'

import { LikeStatus } from '../constants/likes'

import { CreatePostDto } from '../dtos/posts/create-post.dto'
import { UpdatePostDto } from '../dtos/posts/update-post.dto'
import { RequestParams, ResponseBody } from '../types/global'
import { IBlog } from '../types/blogs'
import { IPost, Post } from '../types/posts'
import { Like } from '../types/likes'

export class PostsService {
  constructor(
    protected postsRepository: PostsRepository,
    protected likesService: LikesService
  ) {}

  async getPosts(params: RequestParams, userId: string | null): Promise<ResponseBody<IPost> | null> {
    const posts = await this.postsRepository.getPosts(params)

    if (!posts) {
      return null
    }

    const postsWithInfoAboutLikes = await Promise.all(posts.items.map(async (post) => {
      const likesCounts = await this.likesService.getLikesCountsBySourceId(post.id)

      let likesUserInfo

      if (userId) {
        likesUserInfo = await this.likesService.getLikeBySourceIdAndAuthorId(post.id, userId)
      }

      return {
        ...post,
        likesInfo: {
          likesCount: likesCounts?.likesCount ?? 0,
          dislikesCount: likesCounts?.dislikesCount ?? 0,
          myStatus: likesUserInfo ? likesUserInfo.status : LikeStatus.none
        }
      }
    }))

    return {
      ...posts,
      items: postsWithInfoAboutLikes
    }
  }

  async getPostById(id: string, userId?: string | null): Promise<IPost | null> {
    const post = await this.postsRepository.getPostById(id)
    let myLike: Like | null = null

    if (!post) {
      return null
    }

    const likesCounts = await this.likesService.getLikesCountsBySourceId(post.id)

    if (userId) {
      myLike = await this.likesService.getLikeBySourceIdAndAuthorId(post.id, userId)
    }

    return {
      id: post.id,
      blogId: post.blogId,
      title: post.title,
      content: post.content,
      shortDescription: post.shortDescription,
      blogName: post.blogName,
      createdAt: post.createdAt,
      likesInfo: {
        likesCount: likesCounts?.likesCount ?? 0,
        dislikesCount: likesCounts?.dislikesCount ?? 0,
        myStatus: myLike?.status ?? LikeStatus.none
      }
    }
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
