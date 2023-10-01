import { DBfields } from '../db/constants'
import { getCollection } from '../db/mongo-db'

import { UpdateVideoDto } from '../dtos/videos/update-video.dto'
import { IVideo } from '../types/videos'

const videosDB = getCollection<IVideo>(DBfields.videos)

export const VideosRepository = {
  async getVideos(): Promise<IVideo[]> {
    try {
      const videos = await videosDB.find({}, { projection: { _id: 0 } }).toArray()

      return videos || []
    } catch {
      return []
    }
  },

  async getVideoById(id: string): Promise<IVideo | undefined | null> {
    try {
      const video = await videosDB.findOne({ id }, { projection: { _id: 0 } })

      return video
    } catch {
      return null
    }
  },

  async createVideo(data: IVideo) {
    try {
      let video = null

      const response = await videosDB.insertOne(data)

      if (response.insertedId && data.id) {
        video = await videosDB.findOne({ id: data.id }, { projection: { _id: 0 } })
      }

      return video
    } catch {
      return null
    }
  },

  async updateVideo(id: string, data: UpdateVideoDto) {
    try {
      let video

      const response = await videosDB.updateOne({ id }, { $set: data })

      if (response.modifiedCount) {
        video = await videosDB.findOne({ id }, { projection: { _id: 0 } })
      }

      return video
    } catch {
      return null
    }
  },

  async deleteVideo(id: string) {
    try {
      const response = await videosDB.deleteOne({ id })

      return !!response.deletedCount
    } catch {
      return null
    }
  }
}
