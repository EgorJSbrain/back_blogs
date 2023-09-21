import { NextFunction, Request, Response } from 'express'
import { checkAuthorziation } from '../utils/authValidation/checkAuthorziation'
import { HTTP_STATUSES } from '../constants/global'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if (checkAuthorziation(req.headers.authorization)) {
    next()
  } else {
    res.sendStatus(HTTP_STATUSES.NOT_AUTHORIZED_401)
  }
}
