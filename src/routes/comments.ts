import { Router, Response } from 'express'

import { HTTP_STATUSES } from '../constants/global'
import { validationMiddleware, authMiddleware } from '../middlewares'
import { CommentsService } from '../services'
import { CommentsValidation } from '../utils/validation/inputValidations'

import {
  RequestWithParams,
  RequestWithParamsAndBody
} from '../types/global'
import { IComment } from '../types/comments'
import { UpdateCommentDto } from '../dtos/comments/update-comment.dto'

export const commentsRouter = Router({})

commentsRouter.get(
  '/:id',
  async (req: RequestWithParams<{ id: string }>, res: Response<IComment>) => {
    const { id } = req.params

    if (!id) {
      return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    }

    const comment = await CommentsService.getCommentById(id)

    if (!comment) {
      return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    }

    res.status(HTTP_STATUSES.OK_200).send(comment)
  }
)

commentsRouter.put(
  '/:id',
  authMiddleware,
  CommentsValidation(),
  validationMiddleware,
  async (
    req: RequestWithParamsAndBody<{ id: string }, UpdateCommentDto>,
    res: Response
  ) => {
    const { id } = req.params

    if (!id) {
      return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    }

    const existedComment = await CommentsService.getCommentById(id)

    if (!existedComment) {
      return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    }

    const blog = await CommentsService.updateComment(id, req.body)

    if (!blog) {
      return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    }

    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
  }
)

commentsRouter.delete(
  '/:id',
  authMiddleware,
  async (req: RequestWithParams<{ id: string }>, res: Response) => {
    const { id } = req.params

    if (!id) {
      return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    }

    const response = await CommentsService.deleteComment(id)

    if (!response) {
      return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    }

    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
  }
)
