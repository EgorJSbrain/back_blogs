import { VideosRepository } from '../repositories/videos'

import { CreateVideoDto } from '../dtos/videos/create-video.dto'
import { UpdateVideoDto } from '../dtos/videos/update-video.dto'
import { IVideo, Video } from '../types/videos'

export class VideosService {
  constructor (protected videosRepository: VideosRepository) {}
  async getVideos(): Promise<IVideo[]> {
    return await this.videosRepository.getVideos()
  }

  async getVideoById(id: string): Promise<IVideo | undefined | null> {
    return await this.videosRepository.getVideoById(id)
  }

  async createVideo(data: CreateVideoDto): Promise<IVideo | null> {
    const video = new Video(data)

    return await this.videosRepository.createVideo(video)
  }

  async updateVideo(id: string, data: UpdateVideoDto): Promise<IVideo | null> {
    return await this.videosRepository.updateVideo(id, data)
  }

  async deleteVideo(id: string): Promise<boolean> {
    return await this.videosRepository.deleteVideo(id)
  }
}
