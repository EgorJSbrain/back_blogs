import { db } from "../db/db"
import { CreateVideoDto } from "../dtos/create-video.dto"
import { IVideo } from "../types/videos"


export const VideoService = {
  async getVideos () {
    try {
      const videos = db.videos

      return videos
    } catch {
      return []
    }
  },

  async getVideoById (id: number) {
    try {
      const video = db.videos.find(item => item.id === id)

      return video
      return {}
    } catch {
      return null
    }
  },

  async createVideo (data: CreateVideoDto) {
    try {
      const createdVideo = {
        id: Number(new Date()),
        title: data.title
      }

      db.videos.push(createdVideo)

      return createdVideo
      return {}
    } catch {
      return null
    }
  },

  async updateVideo (id: number, data: CreateVideoDto) {
    try {
      const video = db.videos.find(item => item.id === id)
console.log('---', video)
      const updatedVideo = {
        ...video,
        ...data,
      }
      console.log('-updatedVideo--', updatedVideo)
      const updatedVideos = db.videos.map(video => {
        if (video.id === id) {
          return {
            ...video,
            ...data,
          }
        } else {
          return video
        }
      })

      console.log('-!!!-----updatedVideos--', updatedVideos)

      db.videos = updatedVideos

      return updatedVideo
    } catch {
      return null
    }
  },

  async deleteVideo (id: number) {
    try {
      const videos = db.videos.filter(item => item.id !== id)

      db.videos = videos

      return true
    } catch {
      return null
    }
  },

  async deleteAll () {
    
    try {
      db.videos = []
      return true
    } catch {
      return null
    }
  }
}
