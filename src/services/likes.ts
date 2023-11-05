import { LikesRepository } from '../repositories/likes'
import { ILikes, Like } from '../types/likes'
import { LikeStatus } from '../constants/global'
import { LikeDto } from '../dtos/likes/like.dto'

export class LikesService {
  constructor(protected likesRepository: LikesRepository) {}

  async getLikesCountsBySourceId(sourceId: string): Promise<ILikes | null> {
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

  async createLike(data: LikeDto): Promise<boolean> {
    const like = new Like(data)
    return await this.likesRepository.createLike(like)
  }

  async updateLike(likeId: string, newStatus: LikeStatus): Promise<any> {
    return await this.likesRepository.updateLike(likeId, newStatus)
  }
}
