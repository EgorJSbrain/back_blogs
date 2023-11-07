import { Schema, model } from 'mongoose'
import { Comment as IComment, ICommentInfo } from '../types/comments'

const CommentInfoSchema = new Schema<ICommentInfo>({
  userId: { type: String, required: true },
  userLogin: { type: String, required: true }
})

const CommentSchema = new Schema<IComment>({
  id: { type: String, required: true },
  content: { type: String, required: true },
  createdAt: { type: String, required: true },
  postId: { type: String, required: true },
  commentatorInfo: { type: CommentInfoSchema }
})

export const Comment = model('comments', CommentSchema)
