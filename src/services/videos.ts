import { db } from "../db/db"
import { CreateVideoDto } from "../dtos/create-video.dto"


export const VideoService = {
  async getVideos () {
    try {
      // const videos = db

      // return videos
      return []
    } catch {
      return []
    }
  },

  async getVideoById (id: number) {
    try {
      // const video = db.find(item => item.id === id)

      // return video
      return {}
    } catch {
      return null
    }
  },

  async createVideo (data: CreateVideoDto) {
    try {
      // const video = db.push(data)

      // return video
      return {}
    } catch {
      return null
    }
  },

  async updateVideo (id: string, data: CreateVideoDto) {
    try {
      // const video = db.map(data)

      // return video
      return {}
    } catch {
      return null
    }
  },

  async deleteVideo (id: string) {
    try {

      return {}
      // const video = db.filter(item => item.id === id)

      // return video
    } catch {
      return null
    }
  },

  async deleteAll () {
    try {
      // const deleted = db

      return {}
    } catch {
      return null
    }
  }
}
