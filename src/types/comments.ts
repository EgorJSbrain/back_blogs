// import { LikeStatus } from '../constants/global'
import { RequestParams } from './global'
// import { ILike } from './likes'

export class Comment {
  id: string
  createdAt: string
  commentatorInfo: ICommentInfo
  // likes: ILike[]

  constructor(
    public content: string,
    userId: string,
    userLogin: string,
    public postId: string
  ) {
    this.commentatorInfo = {
      userId,
      userLogin
    }
    // this.likes = []
    this.id = Number(new Date()).toString()
    this.createdAt = new Date().toISOString()
  }
}

export interface ICommentInfo {
  userId: string
  userLogin: string
}

// export interface ICommentLikesInfo {
//   dislikesCount: number
//   likesCount: number
//   myStatus: LikeStatus
// }

// TODO check is that type is requiered
export interface IComment {
  id: string
  content: string
  createdAt: string
  postId: string
  commentatorInfo: ICommentInfo
  // likes: ILike[]
}

export type CommentsRequestParams = RequestParams & {
  postId?: string
}
