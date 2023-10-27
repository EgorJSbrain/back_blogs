import { Schema, model } from 'mongoose'
import { IPost } from '../types/posts'

const PostsSchema = new Schema<IPost>({
  id: { type: String, required: true },
  blogId: { type: String, required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  shortDescription: { type: String, required: true },
  blogName: { type: String, required: true },
  createdAt: { type: String, required: true }
})

export const Post = model('posts', PostsSchema)
