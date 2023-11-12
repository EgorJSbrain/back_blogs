import { Schema, model } from 'mongoose'
import { LikeStatus } from '../constants/likes'
import { Like as LikeType } from '../types/likes'

const LikeSchema = new Schema<LikeType>({
  id: { type: String, required: true },
  authorId: { type: String, required: true },
  sourceId: { type: String, required: true },
  status: { type: String, enum: LikeStatus, required: true },
  createdAt: { type: String, required: true },
  login: { type: String, required: true }
})

export const Like = model('likes', LikeSchema)
