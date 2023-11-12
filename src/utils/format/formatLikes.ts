import { ILikeForPost, Like } from '../../types/likes'

export const formatLikes = (likes: Like[]): ILikeForPost[] =>
  likes.map((newestLike) => ({
    addedAt: newestLike.createdAt,
    userId: newestLike.authorId,
    login: newestLike.login
  }))
