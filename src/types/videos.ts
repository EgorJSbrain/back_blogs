import { VideoAvailableResolutions } from '../constants/videos'
import { CreateVideoDto } from '../dtos/videos/create-video.dto'

export class Video {
  id: string
  createdAt: string
  title: string
  author: string
  publicationDate: string
  availableResolutions: VideoAvailableResolutions[]
  minAgeRestriction: number | null
  canBeDownloaded: boolean

  constructor(data: CreateVideoDto) {
    const createdDate = Number(new Date()) - 1000 * 60 * 60 * 24

    this.id = Number(new Date()).toString()
    this.title = data.title
    this.author = data.author
    this.availableResolutions = data.availableResolutions
    this.minAgeRestriction = data.minAgeRestriction || null
    this.canBeDownloaded = data.canBeDownloaded || false
    this.createdAt = new Date(createdDate).toISOString()
    this.publicationDate = new Date().toISOString()
  }
}

export interface IVideo {
  id: string
  title: string
  author: string
  availableResolutions: VideoAvailableResolutions[]
  createdAt: string
  publicationDate: string
  minAgeRestriction?: number | null
  canBeDownloaded?: boolean
}
