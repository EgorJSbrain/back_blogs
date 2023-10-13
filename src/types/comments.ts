import { RequestParams } from './global'

export interface IComment {
  id: string
  content: string
  createdAt: string
  commentatorInfo: {
    userId: string
    userLogin: string
  }
}

export type CommentsRequestParams = RequestParams & {
  postId?: string
}
