import { VideoAvailableResolutions } from "../constants/videos"

export interface IVideo {
  id: number
  title: string
  author: string
  availableResolutions: VideoAvailableResolutions[]
  canBeDownloaded: boolean
  minAgeRestriction: number | null
  createdAt: string
  publicationDate: string
}