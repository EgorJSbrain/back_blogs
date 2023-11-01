import { Router } from 'express'

import { CommentsValidation, PostsCreateUpdateValidation } from '../utils/validation/inputValidations'
import { authMiddleware, validationMiddleware } from '../middlewares'
import { authJWTMiddleware } from '../middlewares/authJWTMiddleware'
import { postsController } from '../compositions/posts'

export const postsRouter = Router({})

postsRouter.get(
  '/',
  postsController.getPosts.bind(postsController)
)

postsRouter.get(
  '/:id',
  postsController.getPostById.bind(postsController)
)

postsRouter.post(
  '/',
  authMiddleware,
  PostsCreateUpdateValidation(),
  validationMiddleware,
  postsController.createPost.bind(postsController)
)

postsRouter.put(
  '/:id',
  authMiddleware,
  PostsCreateUpdateValidation(),
  validationMiddleware,
  postsController.updatePost.bind(postsController)
)

postsRouter.delete(
  '/:id',
  authMiddleware,
  postsController.deletePost.bind(postsController)
)

postsRouter.get(
  '/:postId/comments',
  postsController.getCommentsByPostId.bind(postsController)
)

postsRouter.post(
  '/:postId/comments',
  authJWTMiddleware,
  CommentsValidation(),
  validationMiddleware,
  postsController.createComment.bind(postsController)
)
