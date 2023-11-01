import { Router, Response } from 'express'

import { HTTP_STATUSES } from '../constants/global'
import { validationMiddleware } from '../middlewares'
import { CommentsService, UsersService } from '../services'
import { CommentsValidation } from '../utils/validation/inputValidations'

import {
  RequestWithParams,
  RequestWithParamsAndBody
} from '../types/global'
import { IComment } from '../types/comments'
import { UpdateCommentDto } from '../dtos/comments/update-comment.dto'
import { authJWTMiddleware } from '../middlewares/authJWTMiddleware'

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

// commentsRouter.put(
//   '/:id',
//   authJWTMiddleware,
//   CommentsValidation(),
//   validationMiddleware,
//   async (
//     req: RequestWithParamsAndBody<{ id: string }, UpdateCommentDto>,
//     res: Response
//   ) => {
//     const { id } = req.params

//     if (!id) {
//       return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
//     }

//     const existedUser = await UsersService.getUserById(req.userId)
//     const existedComment = await CommentsService.getCommentById(id)

//     if (!existedUser) {
//       return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
//     }

//     if (!existedComment) {
//       return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
//     }

//     if (existedComment?.commentatorInfo.userId !== existedUser?.accountData.id) {
//       return res.sendStatus(HTTP_STATUSES.FORBIDEN_403)
//     }

//     if (existedComment?.content === req.body.content) {
//       return res.status(HTTP_STATUSES.OK_200).send(existedComment)
//     }

//     const comment = await CommentsService.updateComment(id, req.body)

//     if (!comment) {
//       return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
//     }

//     res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
//   }
// )

// commentsRouter.delete(
//   '/:id',
//   authJWTMiddleware,
//   async (req: RequestWithParams<{ id: string }>, res: Response) => {
//     const { id } = req.params

//     if (!id) {
//       return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
//     }

//     const existedUser = await UsersService.getUserById(req.userId)
//     const existedComment = await CommentsService.getCommentById(id)

//     if (!existedComment) {
//       return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
//     }

//     if (existedComment?.commentatorInfo.userId !== existedUser?.accountData.id) {
//       return res.sendStatus(HTTP_STATUSES.FORBIDEN_403)
//     }

//     const response = await CommentsService.deleteComment(id)

//     if (!response) {
//       return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
//     }

//     res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
//   }
// )
