import { BlogsRepository, PostsRepository } from '../repositories'

import { CreateBlogDto } from '../dtos/blogs/create-blog.dto'
import { UpdateBlogDto } from '../dtos/blogs/update-blog.dto'
import { Blog, IBlog } from '../types/blogs'
import { CreatePostDto } from '../dtos/posts/create-post.dto'
import { RequestParams, ResponseBody } from '../types/global'
import { CommentsRequestParams } from '../types/comments'
import { IPost, Post } from '../types/posts'
import { LikesRepository } from '../repositories/likes'
import { ILike, ILikes, Like, LikesRequestParams } from '../types/likes'
import { LikeStatus } from '../constants/global'
import { LikeDto } from '../dtos/likes/like.dto'

export class LikesService {
  constructor(
    protected likesRepository: LikesRepository
  ) {}

  async getLikesCountsBySourceId(sourceId: string): Promise<ILikes | null> {
    return await this.likesRepository.getLikesCountsBySourceId(sourceId)
  }

  async getLikeBySourceIdAndAuthorId(sourceId: string, authorId: string): Promise<{ myStatus: LikeStatus } | null> {
    return await this.likesRepository.getLikeBySourceIdAndAuthorId({ sourceId, authorId })
  }

  async createLike(data: LikeDto): Promise<boolean> {
    const like = new Like(data)
    console.log("!!!!!!like:", like)
    return await this.likesRepository.createLike(like)
  }

  // async createBlog(data: CreateBlogDto): Promise<IBlog | null> {
  //   const { name, description, websiteUrl } = data
  //   const createdBlog = new Blog(name, description, websiteUrl)

  //   return await this.blogsRepository.createBlog(createdBlog)
  // }

  // async updateBlog(id: string, data: UpdateBlogDto): Promise<IBlog | null> {
  //   return await this.blogsRepository.updateBlog(id, data)
  // }

  // async deleteBlog(id: string): Promise<boolean> {
  //   return await this.blogsRepository.deleteBlog(id)
  // }

  // async getPostsByBlogId(blogId: string, params: RequestParams): Promise<ResponseBody<IPost> | null> {
  //   return await this.postsRepository.getPostsByBlogId(blogId, params)
  // }

  // async createPostByBlogId(data: CreatePostDto, blog: IBlog): Promise<IPost | null> {
  //   const createdPost = new Post(
  //     {
  //       ...data,
  //       blogId: blog.id
  //     },
  //     blog?.name ?? ''
  //   )

  //   return await this.postsRepository.createPostByBlogId(createdPost)
  // }
}
