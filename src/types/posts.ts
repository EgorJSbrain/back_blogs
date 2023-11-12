import { CreatePostDto } from '../dtos/posts/create-post.dto'
import { IExtendedLikesForPostInfo } from './likes'

export class Post {
  id: string
  createdAt: string
  blogId: string
  title: string
  content: string
  shortDescription: string
  blogName: string
  extendedLikesInfo?: IExtendedLikesForPostInfo

  constructor(data: CreatePostDto, blogName: string, blogId: string) {
    const { title, content, shortDescription } = data
    this.id = Number(new Date()).toString()
    this.createdAt = new Date().toISOString()
    this.blogId = blogId
    this.title = title
    this.content = content
    this.shortDescription = shortDescription
    this.blogName = blogName
  }
}

export interface IPost {
  id: string
  blogId: string
  title: string
  content: string
  shortDescription: string
  blogName: string
  createdAt: string
  extendedLikesInfo?: IExtendedLikesForPostInfo
}
