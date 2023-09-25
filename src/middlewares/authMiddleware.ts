import { NextFunction, Request, Response } from 'express'
import { checkAuthorziation } from '../utils/authValidation/checkAuthorziation'
import { HTTP_STATUSES } from '../constants/global'

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): Response | undefined => {
  if (req.headers.authorization && checkAuthorziation(req.headers.authorization)) {
    next()
  } else {
    return res.sendStatus(HTTP_STATUSES.NOT_AUTHORIZED_401)
  }
}
