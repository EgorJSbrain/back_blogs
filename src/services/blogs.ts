import { BlogsRepository, PostsRepository } from '../repositories'

import { CreateBlogDto } from '../dtos/blogs/create-blog.dto'
import { UpdateBlogDto } from '../dtos/blogs/update-blog.dto'
import { Blog, IBlog } from '../types/blogs'
import { CreatePostDto } from '../dtos/posts/create-post.dto'
import { RequestParams, ResponseBody } from '../types/global'
import { CommentsRequestParams } from '../types/comments'
import { IPost, Post } from '../types/posts'

export class BlogsService {
  constructor(
    protected blogsRepository: BlogsRepository,
    protected postsRepository: PostsRepository
  ) {}

  async getBlogs(params: CommentsRequestParams): Promise<ResponseBody<IBlog> | null> {
    return await this.blogsRepository.getBlogs(params)
  }

  async getBlogById(id: string): Promise<IBlog | null> {
    return await this.blogsRepository.getBlogById(id)
  }

  async createBlog(data: CreateBlogDto): Promise<IBlog | null> {
    const { name, description, websiteUrl } = data
    const createdBlog = new Blog(name, description, websiteUrl)

    return await this.blogsRepository.createBlog(createdBlog)
  }

  async updateBlog(id: string, data: UpdateBlogDto): Promise<IBlog | null> {
    return await this.blogsRepository.updateBlog(id, data)
  }

  async deleteBlog(id: string): Promise<boolean> {
    return await this.blogsRepository.deleteBlog(id)
  }

  async getPostsByBlogId(blogId: string, params: RequestParams): Promise<ResponseBody<IPost> | null> {
    return await this.postsRepository.getPostsByBlogId(blogId, params)
  }

  async createPostByBlogId(data: CreatePostDto, blog: IBlog): Promise<IPost | null> {
    const createdPost = new Post(
      {
        ...data,
        blogId: blog.id
      },
      blog?.name ?? ''
    )

    return await this.postsRepository.createPostByBlogId(createdPost)
  }
}
