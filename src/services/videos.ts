import { generateNewVideo } from './utils'
import { VideosRepository } from '../repositories/videos'

import { CreateVideoDto } from '../dtos/videos/create-video.dto'
import { UpdateVideoDto } from '../dtos/videos/update-video.dto'
import { IVideo } from '../types/videos'

export const VideosService = {
  async getVideos(): Promise<IVideo[]> {
    return await VideosRepository.getVideos()
  },

  async getVideoById(id: string): Promise<IVideo | undefined | null> {
    return await VideosRepository.getVideoById(id)
  },

  async createVideo(data: CreateVideoDto) {
    const createdVideo = generateNewVideo(data)

    return await VideosRepository.createVideo(createdVideo)
  },

  async updateVideo(id: string, data: UpdateVideoDto) {
    return await VideosRepository.updateVideo(id, data)
  },

  async deleteVideo(id: string) {
    return await VideosRepository.deleteVideo(id)
  }
}
