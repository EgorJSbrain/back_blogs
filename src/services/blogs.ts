import { generateNewPost } from './utils'
import { BlogsRepository, PostsRepository } from '../repositories'
import { PostInputFields } from '../constants/posts'

import { CreateBlogDto } from '../dtos/blogs/create-blog.dto'
import { UpdateBlogDto } from '../dtos/blogs/update-blog.dto'
import { Blog, IBlog } from '../types/blogs'
import { CreatePostDto } from '../dtos/posts/create-post.dto'
import { RequestParams, ResponseBody } from '../types/global'
import { CommentsRequestParams } from '../types/comments'
import { IPost } from '../types/posts'

export class BlogsService {
  constructor(protected blogsRepository: BlogsRepository) {}
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
    return await PostsRepository.getPostsByBlogId(blogId, params)
  }

  async createPostByBlogId(data: CreatePostDto, blog: IBlog): Promise<IPost | null> {
    const { title, shortDescription, content } = data

    const creatingData = {
      [PostInputFields.title]: title,
      [PostInputFields.shortDescription]: shortDescription,
      [PostInputFields.content]: content,
      [PostInputFields.blogId]: blog.id,
      [PostInputFields.blogName]: blog?.name ?? ''
    }

    const createdPost = generateNewPost(creatingData)

    return await PostsRepository.createPostByBlogId(createdPost)
  }
}
