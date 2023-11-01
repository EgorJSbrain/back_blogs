import { Router } from 'express'

import { UserCreateValidation } from '../utils/validation/inputValidations'
import { authMiddleware, validationMiddleware } from '../middlewares'
import { usersController } from '../compositions/users'

export const usersRouter = Router({})

usersRouter.get('/', usersController.getUsers.bind(usersController))
usersRouter.post(
  '/',
  authMiddleware,
  UserCreateValidation(),
  validationMiddleware,
  usersController.createUser.bind(usersController)
)
usersRouter.delete(
  '/:id',
  authMiddleware,
  usersController.deleteUser.bind(usersController)
)
