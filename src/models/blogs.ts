import { Schema } from 'mongoose'
import { IBlog } from '../types/blogs'

export const BlogSchema = new Schema<IBlog>({
  id: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  websiteUrl: { type: String, required: true },
  createdAt: { type: String, required: true },
  isMembership: { type: Boolean, required: true }
})
