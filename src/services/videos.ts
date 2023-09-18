import { db } from "../db/db"
import { CreateVideoDto } from "../dtos/create-video.dto"
import { UpdateVideoDto } from "../dtos/update-video.dto"
import { IVideo } from "../types/videos"
import { generateNewVideo } from "./utils"

export const VideoService = {
  async getVideos () {
    try {
      if (!db<IVideo>().videos) {
        return []
      }

      const videos = db<IVideo>().videos

      return videos || []
    } catch {
      return []
    }
  },

  async getVideoById (id: number) {
    try {
      if (!db<IVideo>().videos) {
        return null
      }

      const video = db<IVideo>().videos.find(item => item.id === id)

      return video
    } catch {
      return null
    }
  },

  async createVideo (data: CreateVideoDto) {
    try {
      const createdVideo = generateNewVideo(data)

      const existedVideos = db<IVideo>().videos

      if (!existedVideos) {
        db('videos')
      }

      db<IVideo>().videos.push(createdVideo)

      return createdVideo
    } catch {
      return null
    }
  },

  async updateVideo (id: number, data: UpdateVideoDto) {
    try {
      if (!db<IVideo>().videos) {
        return null
      }

      const video = db<IVideo>().videos.find(item => item.id === id)

      if (!video) {
        return null
      }

      const updatedVideo = {
        ...video,
        ...data,
      }

      const updatedVideos = db<IVideo>().videos.map(video => {
        if (video.id === id) {
          return {
            ...video,
            ...data,
          }
        } else {
          return video
        }
      })

      db<IVideo>().videos = updatedVideos

      return updatedVideo
    } catch {
      return null
    }
  },

  async deleteVideo (id: number) {
    try {
      if (!db<IVideo>().videos) {
        return null
      }
  
      const existedVideo = db<IVideo>().videos.find(item => item.id === id)

      if (!existedVideo) {
        return null
      }

      const videos = db<IVideo>().videos.filter(item => item.id !== id)

      db<IVideo>().videos = videos

      return true
    } catch {
      return null
    }
  },
}
