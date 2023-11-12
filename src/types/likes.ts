import { LikeStatus } from '../constants/likes'
import { LikeDto } from '../dtos/likes/like.dto'

export class Like {
  id: string
  sourceId: string
  authorId: string
  login: string
  status: LikeStatus
  createdAt: string

  constructor(data: LikeDto) {
    this.id = Number(new Date()).toString()
    this.sourceId = data.sourceId
    this.authorId = data.authorId
    this.status = data.status
    this.login = data.login
    this.createdAt = new Date().toISOString()
  }
}

export interface ILikesInfo {
  sourceId: string
  dislikesCount: number
  likesCount: number
}

export interface ILikeInfo {
  dislikesCount: number
  likesCount: number
  myStatus: LikeStatus
}

export interface ILikeForPost {
  login: string
  userId: string
  addedAt: string
}

export interface IExtendedLikesInfo extends ILikeInfo {
  newestLikes: Like[]
}

export interface IExtendedLikesForPostInfo extends ILikeInfo {
  newestLikes: ILikeForPost[]
}

export interface ILike {
  authorId: number
  status: LikeStatus
}

export type LikesRequestParams = {
  sourceId?: string
  authorId?: string
}
