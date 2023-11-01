import { v4 } from 'uuid'
import add from 'date-fns/add'

import { IPost } from '../types/posts'
import { IVideo } from '../types/videos'
import { CreatePostDto } from '../dtos/posts/create-post.dto'
import { CreateVideoDto } from '../dtos/videos/create-video.dto'
import { CreateCommentDto } from '../dtos/comments/create-comment.dto'
import { IComment } from '../types/comments'
import { CreateRequestDto } from '../dtos/requests/create-request.dto'
import { IRequest } from '../types/requests'
import { IRefreshTokenMeta } from '../types/tokens'
import { CreateRefreshTokenDto } from '../dtos/tokens/create-refresh-token.dto'

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

export const generateNewPost = (data: CreatePostDto): IPost => ({
  id: Number(new Date()).toString(),
  blogId: data.blogId,
  title: data.title,
  content: data.content,
  shortDescription: data.shortDescription,
  blogName: data.blogName,
  createdAt: new Date().toISOString()
})

export class User {
  accountData: any
  emailConfirmation: any

  constructor(
    login: string,
    email: string,
    public passwordHash: string,
    public passwordSalt: string,
    isConfirmed?: boolean
  ) {
    this.accountData = {
      id: Number(new Date()).toString(),
      login,
      email,
      createdAt: new Date().toISOString()
    }
    this.emailConfirmation = {
      confirmationCode: v4(),
      expirationDate: add(new Date(), {
        hours: 1,
        minutes: 10
      }),
      isConfirmed: !!isConfirmed
    }
  }
}

export const generateNewComment = (
  data: CreateCommentDto,
  userId: string,
  userLogin: string,
  postId: string
): IComment => ({
  id: Number(new Date()).toString(),
  content: data.content,
  postId,
  commentatorInfo: {
    userId,
    userLogin
  },
  createdAt: new Date().toISOString()
})

export const generateNewReuest = (data: CreateRequestDto): IRequest => ({
  id: Number(new Date()).toString(),
  ip: data.ip,
  url: data.url,
  date: new Date().toISOString()
})

export const generateNewRefreshToken = (
  data: CreateRefreshTokenDto
): IRefreshTokenMeta => {
  const timeStamp = new Date()

  return {
    ip: data.ip,
    userId: data.userId,
    deviceId: v4(),
    title: data.title,
    lastActiveDate: timeStamp.toISOString(),
    expiredDate: add(timeStamp, {
      seconds: 20
    }).toISOString()
  }
}
