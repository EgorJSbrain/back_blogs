import { db } from "../db/db"
import { CreateVideoDto } from "../dtos/create-video.dto"
import { IVideo } from "../types/videos"

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
      const cretedDate = Number(new Date()) + 1000 * 60 * 60 * 24

      const createdVideo = {
        id: Number(new Date()),
        title: data.title,
        author: data.author,
        availableResolutions: data.availableResolutions,
        minAgeRestriction: null,
        canBeDownloaded: true,
        createdAt: new Date(cretedDate).toISOString(),
        publicationDate: new Date().toISOString(),
      }

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

  async updateVideo (id: number, data: CreateVideoDto) {
    try {
      if (!db<IVideo>().videos) {
        return null
      }

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
      if (!db<IVideo>().videos) {
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
