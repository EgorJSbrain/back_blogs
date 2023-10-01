import { IBlog } from '../types/blogs'
import { IPost } from '../types/posts'
import { IVideo } from '../types/videos'
import { CreateBlogDto } from '../dtos/blogs/create-blog.dto'
import { CreatePostDto } from '../dtos/posts/create-post.dto'
import { CreateVideoDto } from '../dtos/videos/create-video.dto'

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
