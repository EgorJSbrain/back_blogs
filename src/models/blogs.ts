import { Schema, model } from 'mongoose'
import { IBlog } from '../types/blogs'

const BlogsSchema = new Schema<IBlog>({
  id: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  websiteUrl: { type: String, required: true },
  createdAt: { type: String, required: true },
  isMembership: { type: Boolean, required: true }
})

export const Blog = model('blogs', BlogsSchema)
