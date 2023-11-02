import { Router } from 'express'

import {
  EmailValidation,
  RecoveryPasswordValidation,
  RegistrationConfirmValidation,
  UserCreateValidation,
  UserEmailValidation,
  UserLoginValidation
} from '../utils/validation/inputValidations'
import { validationMiddleware } from '../middlewares'
import { authJWTMiddleware } from '../middlewares/authJWTMiddleware'
import { authController } from '../compositions/auth'

export const authRouter = Router({})

authRouter.post(
  '/login',
  UserLoginValidation(),
  validationMiddleware,
  authController.login.bind(authController)
)

authRouter.post(
  '/registration',
  UserCreateValidation(),
  validationMiddleware,
  authController.registration.bind(authController)
)

authRouter.post(
  '/registration-email-resending',
  UserEmailValidation(),
  validationMiddleware,
  authController.resendRegistrationEmail.bind(authController)
)

authRouter.post(
  '/registration-confirmation',
  RegistrationConfirmValidation(),
  validationMiddleware,
  authController.confirmRegistration.bind(authController)
)

authRouter.post(
  '/password-recovery',
  EmailValidation(),
  validationMiddleware,
  authController.recoveryPassword.bind(authController)
)

authRouter.post(
  '/new-password',
  RecoveryPasswordValidation(),
  validationMiddleware,
  authController.setNewPassword.bind(authController)
)

authRouter.get(
  '/me',
  authJWTMiddleware,
  authController.getMe.bind(authController)
)

authRouter.post(
  '/refresh-token',
  authController.refreshToken.bind(authController)
)

authRouter.post(
  '/logout',
  authController.logout.bind(authController)
)
