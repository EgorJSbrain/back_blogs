import { LikeStatus } from '../../constants/global'

export interface LikeDto {
  readonly sourceId: string
  readonly authorId: string
  readonly status: LikeStatus
}
