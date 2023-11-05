import { CommentsRepository } from '../repositories'
import { RequestParams, ResponseBody } from '../types/global'
import { CreateCommentDto } from '../dtos/comments/create-comment.dto'
import { IUser } from '../types/users'
import { UpdateCommentDto } from '../dtos/comments/update-comment.dto'
import { Comment as CommentType, IComment } from '../types/comments'

export class CommentsService {
  constructor(protected commentsRepository: CommentsRepository) {}

  async getCommentsByPostId(params: RequestParams, postId: string): Promise<ResponseBody<CommentType> | null> {
    return await this.commentsRepository.getCommentsByPostId(params, postId)
  }

  async getCommentById(id: string): Promise<IComment | null> {
    return await this.commentsRepository.getCommentById(id)
  }

  async createComment(data: CreateCommentDto, user: IUser, postId: string): Promise<CommentType | null> {
    const createdComment = new CommentType(data.content, user.accountData.id, user.accountData.login, postId)

    return await this.commentsRepository.createComment(createdComment)
  }

  async updateComment(id: string, data: UpdateCommentDto): Promise<IComment | null> {
    return await this.commentsRepository.updateComment(id, data)
  }

  async deleteComment(id: string): Promise<boolean> {
    return await this.commentsRepository.deleteComment(id)
  }
}
