export interface IComment {
  id: string
  content: string
  createdAt: string
  commentatorInfo: {
    userId: string
    userLogin: string
  }
}
