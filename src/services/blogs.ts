import { generateNewBlog, generateNewPost } from './utils'
import { BlogsRepository, PostsRepository } from '../repositories'

import { CreateBlogDto } from '../dtos/blogs/create-blog.dto'
import { UpdateBlogDto } from '../dtos/blogs/update-blog.dto'
import { BlogPostsRequestParams, BlogsRequestParams, IBlog } from '../types/blogs'
import { BlogInputFields } from '../constants/blogs'
import { PostInputFields } from '../constants/posts'
import { CreatePostDto } from '../dtos/posts/create-post.dto'

export const BlogsService = {
  async getBlogs(params: BlogsRequestParams) {
    return await BlogsRepository.getBlogs(params)
  },

  async getBlogById(id: string) {
    return await BlogsRepository.getBlogById(id)
  },

  async createBlog(data: CreateBlogDto) {
    const { name, description, websiteUrl } = data

    const creatingData = {
      [BlogInputFields.name]: name,
      [BlogInputFields.description]: description,
      [BlogInputFields.websiteUrl]: websiteUrl
    }
    const createdBlog = generateNewBlog(creatingData)

    return await BlogsRepository.createBlog(createdBlog)
  },

  async updateBlog(id: string, data: UpdateBlogDto) {
    return await BlogsRepository.updateBlog(id, data)
  },

  async deleteBlog(id: string) {
    return await BlogsRepository.deleteBlog(id)
  },

  async getPostsByBlogId(params: BlogPostsRequestParams) {
    return await PostsRepository.getPostsByBlogId(params)
  },

  async createPostByBlogId(data: CreatePostDto, blog: IBlog) {
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
