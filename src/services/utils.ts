import bcrypt from 'bcrypt'
import { IBlog } from '../types/blogs'
import { IPost } from '../types/posts'
import { IVideo } from '../types/videos'
import { CreateBlogDto } from '../dtos/blogs/create-blog.dto'
import { CreatePostDto } from '../dtos/posts/create-post.dto'
import { CreateVideoDto } from '../dtos/videos/create-video.dto'
import { CreateUserDto } from '../dtos/users/create-user.dto'
import { ICreatingUser } from '../types/users'

export const generateNewVideo = (data: CreateVideoDto): IVideo => {
  const createdDate = Number(new Date()) - 1000 * 60 * 60 * 24

  return {
    id: Number(new Date()).toString(),
    title: data.title,
    author: data.author,
    availableResolutions: data.availableResolutions,
    minAgeRestriction: data.minAgeRestriction || null,
    canBeDownloaded: data.canBeDownloaded || false,
    createdAt: new Date(createdDate).toISOString(),
    publicationDate: new Date().toISOString()
  }
}

export const generateNewBlog = (data: CreateBlogDto): IBlog => ({
  id: Number(new Date()).toString(),
  name: data.name,
  description: data.description,
  websiteUrl: data.websiteUrl,
  createdAt: new Date().toISOString(),
  isMembership: false
})

export const generateNewPost = (data: CreatePostDto): IPost => ({
  id: Number(new Date()).toString(),
  blogId: data.blogId,
  title: data.title,
  content: data.content,
  shortDescription: data.shortDescription,
  blogName: data.blogName,
  createdAt: new Date().toISOString()
})

export const generateNewUser = async (data: CreateUserDto): Promise<ICreatingUser> => {
  const passwordSalt = await bcrypt.genSalt(10)
  const passwordHash = await bcrypt.hash(data.password, passwordSalt)

  return {
    id: Number(new Date()).toString(),
    login: data.login,
    passwordHash,
    passwordSalt,
    email: data.email,
    createdAt: new Date().toISOString()
  }
}
