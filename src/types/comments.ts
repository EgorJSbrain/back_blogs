import { RequestParams } from './global'

export class Comment {
  id: string
  createdAt: string
  commentatorInfo: ICommentInfo

  constructor(
    userId: string,
    userLogin: string,
    public content: string,
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
  postId: string
  commentatorInfo: ICommentInfo
}

export type CommentsRequestParams = RequestParams & {
  postId?: string
}
