import { Router } from 'express'
import { validationMiddleware, authMiddleware } from '../middlewares'

import {
  BlogsCreateUpdateValidation,
  PostCreateByBlogIdValidation
} from '../utils/validation/inputValidations'
import { blogsController } from '../compositions/blogs'

export const blogsRouter = Router({})

blogsRouter.get('/', blogsController.getBlogs.bind(blogsController))
blogsRouter.get('/:id', blogsController.getBlogById.bind(blogsController))
blogsRouter.post(
  '/',
  authMiddleware,
  BlogsCreateUpdateValidation(),
  validationMiddleware,
  blogsController.createBlog.bind(blogsController)
)

blogsRouter.put(
  '/:id',
  authMiddleware,
  BlogsCreateUpdateValidation(),
  validationMiddleware,
  blogsController.updateBlog.bind(blogsController)
)

blogsRouter.delete(
  '/:id',
  authMiddleware,
  blogsController.deleteBlog.bind(blogsController)
)

blogsRouter.get(
  '/:blogId/posts',
  blogsController.getPostsByBlogId.bind(blogsController)
)

blogsRouter.post(
  '/:blogId/posts',
  authMiddleware,
  PostCreateByBlogIdValidation(),
  validationMiddleware,
  blogsController.creatPostByBlogId.bind(blogsController)
)
