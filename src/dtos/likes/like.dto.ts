import { LikeStatus } from '../../constants/likes'

export interface LikeDto {
  readonly sourceId: string
  readonly authorId: string
  readonly status: LikeStatus
}
