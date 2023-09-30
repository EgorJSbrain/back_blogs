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
      const videos = await videosDB.find({}, { projection: { _id: 0 } }).toArray()

      return videos || []
    } catch {
      return []
    }
  },

  async getVideoById(id: number): Promise<IVideo | undefined | null> {
    try {
      const video = await videosDB.findOne({ id }, { projection: { _id: 0 } })

      return video
    } catch {
      return null
    }
  },

  async createVideo(data: CreateVideoDto) {
    try {
      let video = null
      const createdVideo = generateNewVideo(data)

      const response = await videosDB.insertOne(createdVideo)

      if (response.insertedId && createdVideo.id) {
        video = await videosDB.findOne({ id: createdVideo.id }, { projection: { _id: 0 } })
      }

      return video
    } catch {
      return null
    }
  },

  async updateVideo(id: number, data: UpdateVideoDto) {
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

  async deleteVideo(id: number) {
    try {
      const response = await videosDB.deleteOne({ id })

      return !!response.deletedCount
    } catch {
      return null
    }
  }
}
