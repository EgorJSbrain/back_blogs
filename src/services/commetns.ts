import { generateNewComment } from './utils'
import { CommentsRepository } from '../repositories'
import { RequestParams } from '../types/global'
import { CreateCommentDto } from '../dtos/comments/create-comment.dto'
import { IUser } from '../types/users'
import { CommentInputFields } from '../constants/comments'
import { UpdateCommentDto } from '../dtos/comments/update-comment.dto'

export const CommentsService = {
  async getCommentsByPostId(params: RequestParams, postId: string) {
    return await CommentsRepository.getCommentsByPostId(params, postId)
  },

  async getCommentById(id: string) {
    return await CommentsRepository.getCommentById(id)
  },

  async createComment(data: CreateCommentDto, user: IUser, postId: string) {
    const { content } = data

    const creatingData = {
      [CommentInputFields.content]: content
    }

    const createdComment = generateNewComment(creatingData, user.accountData.id, user.accountData.login, postId)

    return await CommentsRepository.createComment(createdComment)
  },

  async updateComment(id: string, data: UpdateCommentDto) {
    return await CommentsRepository.updateComment(id, data)
  },

  async deleteComment(id: string) {
    return await CommentsRepository.deleteComment(id)
  }
}
