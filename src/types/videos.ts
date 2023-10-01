import { VideoAvailableResolutions } from '../constants/videos'

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
