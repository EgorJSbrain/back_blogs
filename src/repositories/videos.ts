import { Video } from '../models'
import { UpdateVideoDto } from '../dtos/videos/update-video.dto'
import { IVideo } from '../types/videos'

export class VideosRepository {
  async getVideos(): Promise<IVideo[]> {
    try {
      const videos = await Video.find({}, { projection: { _id: 0 } }).lean()

      return videos || []
    } catch {
      return []
    }
  }

  async getVideoById(id: string): Promise<IVideo | undefined | null> {
    try {
      const video = await Video.findOne({ id }, { projection: { _id: 0 } })

      return video
    } catch {
      return null
    }
  }

  async createVideo(data: IVideo): Promise<IVideo | null> {
    try {
      let video = null

      const response = await Video.create(data)

      if (response._id && data.id) {
        video = await Video.findOne({ id: data.id }, { projection: { _id: 0 } })
      }

      return video
    } catch {
      return null
    }
  }

  async updateVideo(id: string, data: UpdateVideoDto): Promise<IVideo | null> {
    try {
      let video = null

      const response = await Video.updateOne({ id }, { $set: data })

      if (response.modifiedCount) {
        video = await Video.findOne({ id }, { projection: { _id: 0 } })
      }

      return video
    } catch {
      return null
    }
  }

  async deleteVideo(id: string): Promise<boolean> {
    try {
      const response = await Video.deleteOne({ id })

      return !!response.deletedCount
    } catch {
      return false
    }
  }
}
