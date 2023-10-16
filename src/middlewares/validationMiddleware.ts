import { NextFunction, Response, Request } from 'express'
import { FieldValidationError, Result, ValidationError, validationResult } from 'express-validator'
import { HTTP_STATUSES } from '../constants/global'
import { transformErrors } from '../utils/validation/inputValidations'

export const validationMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): Response | undefined => {
  const resultValidation: Result<ValidationError> = validationResult(req)

  if (!resultValidation.isEmpty()) {
    return res.status(HTTP_STATUSES.BAD_REQUEST_400).send({
      errorsMessages: transformErrors(
        resultValidation.array({
          onlyFirstError: true
        }) as FieldValidationError[]
      )
    })
  }

  next()
}
