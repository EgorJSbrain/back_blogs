import { db } from "../db/db"
import { CreateVideoDto } from "../dtos/create-video.dto"
import { IVideo } from "../types/videos"

export const VideoService = {
  async getVideos () {
    try {
      const videos = db<IVideo>().videos

      return videos || []
    } catch {
      return []
    }
  },

  async getVideoById (id: number) {
    try {
      const video = db<IVideo>().videos.find(item => item.id === id)

      return video
    } catch {
      return null
    }
  },

  async createVideo (data: CreateVideoDto) {
    try {
      const createdVideo = {
        id: Number(new Date()),
        title: data.title,
        author: data.author,
        availableResolutions: data.availableResolutions,
        minAgeRestriction: null,
        canBeDownloaded: true,
        createdAt: new Date().toISOString(),
        publicationDate: new Date().toISOString(),
      }

      db<IVideo>().videos.push(createdVideo)

      return createdVideo
    } catch {
      return null
    }
  },

  async updateVideo (id: number, data: CreateVideoDto) {
    try {
      const video = db<IVideo>().videos.find(item => item.id === id)

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
      const videos = db<IVideo>().videos.filter(item => item.id !== id)

      db<IVideo>().videos = videos

      return true
    } catch {
      return null
    }
  },
}
