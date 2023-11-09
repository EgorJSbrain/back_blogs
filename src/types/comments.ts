import { RequestParams } from './global'
import { ILikeInfo } from './likes'

export class Comment {
  id: string
  createdAt: string
  commentatorInfo: ICommentInfo

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
    this.id = Number(new Date()).toString()
    this.createdAt = new Date().toISOString()
  }
}

export interface ICommentInfo {
  userId: string
  userLogin: string
}
export interface IComment {
  id: string
  content: string
  createdAt: string
  commentatorInfo: ICommentInfo
  likesInfo?: ILikeInfo
}

export type CommentsRequestParams = RequestParams & {
  postId?: string
}
