import { DBfields } from "../db/constants"
import { db } from "../db/db"
import { CreateBlogDto } from "../dtos/blogs/create-blog.dto"
import { UpdateBlogDto } from "../dtos/blogs/update-blog.dto"
import { IBlog } from "../types/blogs"
import { generateNewBlog } from "./utils"

export const BlogsService = {
  async getBlogs () {
    try {
      if (!db<IBlog>().blogs) {
        return []
      }

      const blogs = db<IBlog>().blogs

      return blogs || []
    } catch {
      return []
    }
  },

  async getBlogById (id: string) {
    try {
      if (!db<IBlog>().blogs) {
        return null
      }

      const blog = db<IBlog>().blogs.find(item => item.id === id)

      return blog
    } catch {
      return null
    }
  },

  async createBlog (data: CreateBlogDto) {
    try {
      const createdBlog = generateNewBlog(data)

      const existedBlogs = db<IBlog>().blogs

      if (!existedBlogs) {
        db(DBfields.blogs)
      }

      db<IBlog>().blogs.push(createdBlog)

      return createdBlog
    } catch {
      return null
    }
  },

  async updateBlog (id: string, data: UpdateBlogDto) {
    try {
      if (!db<IBlog>().blogs) {
        return null
      }

      const blog = db<IBlog>().blogs.find(item => item.id === id)

      if (!blog) {
        return null
      }

      const updatedBlog = {
        ...blog,
        ...data,
      }

      const updatedBlogs = db<IBlog>().blogs.map(blog => {
        if (blog.id === id) {
          return updatedBlog
        } else {
          return blog
        }
      })

      db<IBlog>().blogs = updatedBlogs

      return updatedBlog
    } catch {
      return null
    }
  },

  async deleteBlog (id: string) {
    try {
      if (!db<IBlog>().blogs) {
        return null
      }
  
      const existedBlog = db<IBlog>().blogs.find(item => item.id === id)

      if (!existedBlog) {
        return null
      }

      const blogs = db<IBlog>().blogs.filter(item => item.id !== id)

      db<IBlog>().blogs = blogs

      return true
    } catch {
      return null
    }
  },
}
