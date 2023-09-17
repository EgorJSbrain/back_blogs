import { VideoAvailableResolutions } from "../constants/videos"

export interface CreateVideoDto {
  readonly title: string
  readonly author: string
  readonly canBeDownloaded: boolean
  readonly availableResolutions: VideoAvailableResolutions[]
  readonly minAgeRestriction?: number
}