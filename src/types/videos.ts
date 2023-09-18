export interface IVideo {
  id: number
  title: string
  author: string
  availableResolutions: string[]
  createdAt: string
  publicationDate: string
  minAgeRestriction?: number | null
  canBeDownloaded?: boolean
}