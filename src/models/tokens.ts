import { Schema, model } from 'mongoose'
import { IRefreshTokenMeta } from '../types/tokens'

const TokenSchema = new Schema<IRefreshTokenMeta>({
  ip: { type: String, required: true },
  deviceId: { type: String, required: true },
  title: { type: String, required: true },
  userId: { type: String, required: true },
  lastActiveDate: { type: String, required: true },
  expiredDate: { type: String, required: true }
})

export const Token = model('tokens', TokenSchema)
