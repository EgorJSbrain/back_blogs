import { Response } from 'express'
import { CommentsService, UsersService } from '../services'
import {
  RequestWithParams,
  RequestWithParamsAndBody
} from '../types/global'

import { HTTP_STATUSES } from '../constants/global'
import { IComment } from '../types/comments'
import { UpdateCommentDto } from '../dtos/comments/update-comment.dto'

export class CommentsController {
  constructor(protected commentsService: CommentsService, protected usersService: UsersService) {}

  async getCommentById (req: RequestWithParams<{ id: string }>, res: Response<IComment>): Promise<undefined> {
    const { id } = req.params

    if (!id) {
      res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
      return
    }

    const comment = await this.commentsService.getCommentById(id)

    if (!comment) {
      res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
      return
    }

    res.status(HTTP_STATUSES.OK_200).send(comment)
  }

  async updateComment (
    req: RequestWithParamsAndBody<{ id: string }, UpdateCommentDto>,
    res: Response
  ): Promise<undefined> {
    const { id } = req.params

    if (!id) {
      res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
      return
    }

    const existedUser = await this.usersService.getUserById(req.userId)
    const existedComment = await this.commentsService.getCommentById(id)

    if (!existedUser) {
      res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
      return
    }

    if (!existedComment) {
      res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
      return
    }

    if (existedComment?.commentatorInfo.userId !== existedUser?.accountData.id) {
      res.sendStatus(HTTP_STATUSES.FORBIDEN_403)
      return
    }

    if (existedComment?.content === req.body.content) {
      res.status(HTTP_STATUSES.OK_200).send(existedComment)
      return
    }

    const comment = await this.commentsService.updateComment(id, req.body)

    if (!comment) {
      res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
      return
    }

    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
  }

  async deleteComment (req: RequestWithParams<{ id: string }>, res: Response): Promise<undefined> {
    const { id } = req.params

    if (!id) {
      res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
      return
    }

    const existedUser = await this.usersService.getUserById(req.userId)
    const existedComment = await this.commentsService.getCommentById(id)

    if (!existedComment) {
      res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
      return
    }

    if (existedComment?.commentatorInfo.userId !== existedUser?.accountData.id) {
      res.sendStatus(HTTP_STATUSES.FORBIDEN_403)
      return
    }

    const response = await this.commentsService.deleteComment(id)

    if (!response) {
      res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
      return
    }

    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
  }
}
