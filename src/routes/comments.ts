import { Router } from 'express'

import { validationMiddleware } from '../middlewares'
import { CommentsLikeValidation, CommentsValidation } from '../utils/validation/inputValidations'

import { authJWTMiddleware } from '../middlewares/authJWTMiddleware'
import { commentsController } from '../compositions/comments'

export const commentsRouter = Router({})

commentsRouter.get(
  '/:id',
  commentsController.getCommentById.bind(commentsController)
)

commentsRouter.put(
  '/:id',
  authJWTMiddleware,
  CommentsValidation(),
  validationMiddleware,
  commentsController.updateComment.bind(commentsController)
)

commentsRouter.put(
  '/:commentId/like-status',
  authJWTMiddleware,
  CommentsLikeValidation(),
  validationMiddleware,
  commentsController.likeComment.bind(commentsController)
)

commentsRouter.delete(
  '/:id',
  authJWTMiddleware,
  commentsController.deleteComment.bind(commentsController)
)
