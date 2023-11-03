import { FilterQuery } from 'mongoose'

import { LikeStatus } from '../constants/global'
import { Like } from '../models'
import { ILike, ILikes, LikesRequestParams } from '../types/likes'
import { Like as LikeType } from '../types/likes'

export class LikesRepository {
  async getLikesCountsBySourceId(sourceId: string): Promise<ILikes | null> {
    try {
      const filter: FilterQuery<ILikes> = { sourceId }

      const likesCount = await Like.countDocuments({ ...filter, likesCount: 'likesCount' })
      const dislikesCount = await Like.countDocuments({ ...filter, dislikesCount: 'dislikesCount' })

      // const like = await Like
      //   .findOne({ authorId: params.authorId }, { projection: { _id: 0 } })
      //   .lean()

      return {
        dislikesCount,
        likesCount
        // myStatus: like ? like.myStatus : LikeStatus.none
      }
    } catch {
      return null
    }
  }

  async getLikeBySourceIdAndAuthorId(params: LikesRequestParams): Promise<{ myStatus: LikeStatus } | null> {
    try {
      const like = await Like
        .findOne({ sourceId: params.sourceId, authorId: params.authorId }, { projection: { _id: 0 } })
        .lean()

      if (!like) {
        return null
      }

      return {
        myStatus: like ? like.status : LikeStatus.none
      }
    } catch {
      return null
    }
  }

  async createLike(data: LikeType): Promise<boolean> {
    try {
      const response = await Like.create(data)

      return !!response._id
    } catch {
      return false
    }
  }
}
