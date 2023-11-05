import { Schema, model } from 'mongoose'
import { Comment as IComment, ICommentInfo } from '../types/comments'
// import { LikeStatus } from '../constants/global'
// import { ILike } from '../types/likes'

const CommentInfoSchema = new Schema<ICommentInfo>({
  userId: { type: String, required: true },
  userLogin: { type: String, required: true }
})

// const CommentLikeSchema = new Schema<ILike>({
//   authorId: { type: Number, required: true },
//   status: { type: String, enum: LikeStatus, required: true }
// })

const CommentSchema = new Schema<IComment>({
  id: { type: String, required: true },
  content: { type: String, required: true },
  createdAt: { type: String, required: true },
  postId: { type: String, required: true },
  commentatorInfo: { type: CommentInfoSchema }
  // likes: { type: [CommentLikeSchema] }
})

export const Comment = model('comments', CommentSchema)
