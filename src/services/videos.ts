import { DBfields } from '../db/constants'
import { getCollection } from '../db/mongo-db'
import { generateNewVideo } from './utils'

import { CreateVideoDto } from '../dtos/videos/create-video.dto'
import { UpdateVideoDto } from '../dtos/videos/update-video.dto'
import { IVideo } from '../types/videos'

const videosDB = getCollection<IVideo>(DBfields.videos)

export const VideosService = {
  async getVideos(): Promise<IVideo[]> {
    try {
      const videos = await videosDB.find({}).toArray()

      return videos || []
    } catch {
      return []
    }
  },

  async getVideoById(id: number): Promise<IVideo | undefined | null> {
    try {
      const video = await videosDB.findOne({ id })

      return video
    } catch {
      return null
    }
  },

  async createVideo(data: CreateVideoDto) {
    try {
      const createdVideo = generateNewVideo(data)

      await videosDB.insertOne(createdVideo)

      return createdVideo
    } catch {
      return null
    }
  },

  async updateVideo(id: number, data: UpdateVideoDto) {
    try {
      const response = await videosDB.updateOne({ id }, { $set: data })

      return !!response.modifiedCount
    } catch {
      return null
    }
  },

  async deleteVideo(id: number) {
    try {
      const response = await videosDB.deleteOne({ id })

      return !!response.deletedCount
    } catch {
      return null
    }
  }
}
