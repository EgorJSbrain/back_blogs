import { VideoAvailableResolutions } from "../constants/videos"

export interface CreateVideoDto {
  readonly title: string
  readonly author: string
  readonly availableResolutions: string[]
  readonly canBeDownloaded?: boolean
  readonly minAgeRestriction?: number
}