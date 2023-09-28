import { client } from '../db/mongo-db'
import { CreateVideoDto } from '../dtos/videos/create-video.dto'
import { UpdateVideoDto } from '../dtos/videos/update-video.dto'
import { IVideo } from '../types/videos'
import { generateNewVideo } from './utils'

const videosDB = client.db().collection<IVideo>('videos')

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
      await videosDB.updateOne({ id }, { $set: data })
    } catch {
      return null
    }
  },

  async deleteVideo(id: number) {
    try {
      await videosDB.deleteOne({ id })

      return true
    } catch {
      return null
    }
  }
}
