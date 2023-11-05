import { FilterQuery } from 'mongoose'

import { LikeStatus } from '../constants/global'
import { Like } from '../models'
import { Like as LikeType, ILikes, LikesRequestParams } from '../types/likes'

export class LikesRepository {
  async getLikesCountsBySourceId(sourceId: string): Promise<ILikes | null> {
    try {
      const filter: FilterQuery<ILikes> = { sourceId }

      const likesCount = await Like.countDocuments({ ...filter, status: 'Like' })
      const dislikesCount = await Like.countDocuments({ ...filter, status: 'Dislike' })

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

  async getLikeBySourceIdAndAuthorId(params: LikesRequestParams): Promise<LikeType | null> {
    try {
      const like = await Like
        .findOne({ sourceId: params.sourceId, authorId: params.authorId }, { projection: { _id: 0 } })
        .lean()

      if (!like) {
        return null
      }

      return like
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

  async updateLike(id: string, newStatus: LikeStatus): Promise<boolean> {
    try {
      const response = await Like.updateOne({ id }, { status: newStatus })

      return !!response
    } catch {
      return false
    }
  }
}
