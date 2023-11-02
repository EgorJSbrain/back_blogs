import { NextFunction, Request, Response } from 'express'
import { HTTP_STATUSES } from '../constants/global'
import { jwtService } from '../applications/jwt-service'

export const authJWTRefrshMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<undefined> => {
  const token = req.cookies.refreshToken

  if (!token) {
    res.sendStatus(HTTP_STATUSES.NOT_AUTHORIZED_401)
    return
  }

  const userId = await jwtService.verifyExperationToken(token)

  if (!userId) {
    res.sendStatus(HTTP_STATUSES.NOT_AUTHORIZED_401)
    return
  }

  if (userId) {
    req.userId = userId

    next()
  }
}
