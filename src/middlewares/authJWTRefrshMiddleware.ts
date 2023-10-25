import { NextFunction, Request, Response } from 'express'
import { HTTP_STATUSES } from '../constants/global'
import { JwtService } from '../applications/jwt-service'

export const authJWTRefrshMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | undefined> => {
  const token = req.cookies.refreshToken

  if (!token) {
    return res.sendStatus(HTTP_STATUSES.NOT_AUTHORIZED_401)
  }

  const userId = await JwtService.verifyExperationToken(token)

  if (!userId) {
    return res.sendStatus(HTTP_STATUSES.NOT_AUTHORIZED_401)
  }

  if (userId) {
    req.userId = userId

    next()
  }
}
