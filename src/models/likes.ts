import { Schema, model } from 'mongoose'
import { LikeStatus } from '../constants/global'
import { Like as LikeType } from '../types/likes'

// const LikeSchema = new Schema<LikeType>({
//   id: { type: String, required: true },
//   dislikesCount: { type: Number, required: true },
//   likesCount: { type: Number, required: true },
//   myStatus: { type: String, enum: LikeStatus, required: true }
// })

const LikeSchema = new Schema<LikeType>({
  id: { type: String, required: true },
  authorId: { type: String, required: true },
  sourceId: { type: String, required: true },
  status: { type: String, enum: LikeStatus, required: true }
})

export const Like = model('likes', LikeSchema)
