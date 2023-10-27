import { Schema, model } from 'mongoose'
import { IVideo } from '../types/videos'
import { VideoAvailableResolutions } from '../constants/videos'

const VideoSchema = new Schema<IVideo>({
  id: { type: String, required: true },
  title: { type: String, required: true },
  author: { type: String, required: true },
  availableResolutions: { type: [String], enum: VideoAvailableResolutions, required: true },
  createdAt: { type: String, required: true },
  publicationDate: { type: String, required: true },
  minAgeRestriction: { type: Number },
  canBeDownloaded: { type: Boolean }
})

export const Video = model('videos', VideoSchema)
