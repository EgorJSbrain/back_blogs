import { CreateBlogDto } from "../dtos/blogs/create-blog.dto"
import { CreateVideoDto } from "../dtos/videos/create-video.dto"
import { IBlog } from "../types/blogs"
import { IVideo } from "../types/videos"

export const generateNewVideo = (data: CreateVideoDto): IVideo => {
  const createdDate = Number(new Date()) - 1000 * 60 * 60 * 24

  return {
    id: Number(new Date()),
    title: data.title,
    author: data.author,
    availableResolutions: data.availableResolutions,
    minAgeRestriction: data.minAgeRestriction || null,
    canBeDownloaded: data.canBeDownloaded || false,
    createdAt: new Date(createdDate).toISOString(),
    publicationDate: new Date().toISOString(),
  }
}

export const generateNewBlog = (data: CreateBlogDto): IBlog => ({
  id: Number(new Date()).toString(),
  name: data.name,
  description: data.description,
  websiteUrl: data.websiteUrl,
})
