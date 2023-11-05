import { LikeStatus } from '../constants/global'
import { LikeDto } from '../dtos/likes/like.dto'

// export class Like {
//   id: string
//   constructor(
//     public sourceId: string,
//     public authorId: string,
//     public dislikesCount: number,
//     public likesCount: number,
//     public myStatus: LikeStatus
//   ) {
//     this.id = Number(new Date()).toString()
//   }
// }

export class Like {
  id: string
  sourceId: string
  authorId: string
  status: LikeStatus

  constructor(data: LikeDto) {
    this.id = Number(new Date()).toString()
    this.sourceId = data.sourceId
    this.authorId = data.authorId
    this.status = data.status
  }
}

export interface ILikes {
  dislikesCount: number
  likesCount: number
  // myStatus: LikeStatus
}

export interface ILikeInfo {
  dislikesCount: number
  likesCount: number
  myStatus: LikeStatus
}

export interface ILike {
  authorId: number
  status: LikeStatus
}

export type LikesRequestParams = {
  sourceId?: string
  authorId?: string
}
