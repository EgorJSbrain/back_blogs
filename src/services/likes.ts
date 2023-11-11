import { LikesRepository } from '../repositories/likes'
import { ILikesInfo, Like } from '../types/likes'
import { LikeStatus } from '../constants/likes'
import { LikeDto } from '../dtos/likes/like.dto'

export class LikesService {
  constructor(
    protected likesRepository: LikesRepository
  ) {}

  async getLikesCountsBySourceId(sourceId: string): Promise<ILikesInfo | null> {
    return await this.likesRepository.getLikesCountsBySourceId(sourceId)
  }

  async getLikeBySourceIdAndAuthorId(
    sourceId: string,
    authorId: string
  ): Promise<Like | null> {
    return await this.likesRepository.getLikeBySourceIdAndAuthorId({
      sourceId,
      authorId
    })
  }

  async getSegmentOfLikesByParams(
    sourceId: string,
    limit: number,
    authorId?: string
  ): Promise<Like[]> {
    return await this.likesRepository.getSegmentOfLikesByParams(
      sourceId,
      limit,
      authorId
    ) || []
  }

  async createLike(data: LikeDto): Promise<boolean> {
    const like = new Like(data)
    return await this.likesRepository.createLike(like)
  }

  async updateLike(likeId: string, newStatus: LikeStatus): Promise<any> {
    return await this.likesRepository.updateLike(likeId, newStatus)
  }

  async likeEntity(
    likeStatus: LikeStatus,
    sourceId: string,
    userId: string,
    userLogin: string
  ): Promise<boolean> {
    const like = await this.getLikeBySourceIdAndAuthorId(sourceId, userId)

    if (!like && (likeStatus === LikeStatus.like || likeStatus === LikeStatus.dislike)) {
      const newLike = await this.createLike({
        sourceId,
        authorId: userId,
        status: likeStatus,
        login: userLogin
      })

      if (!newLike) {
        return false
      }
    }

    if (like && likeStatus !== like.status) {
      const updatedLike = await this.updateLike(like.id, likeStatus)

      if (!updatedLike) {
        return false
      }
    }

    return true
  }
}
