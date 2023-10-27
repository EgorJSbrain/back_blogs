import { RequestParams } from './global'

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
