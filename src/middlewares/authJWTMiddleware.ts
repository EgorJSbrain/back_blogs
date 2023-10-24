import { NextFunction, Request, Response } from 'express'
import { HTTP_STATUSES } from '../constants/global'
import { JwtService } from '../applications/jwt-service'

export const authJWTMiddleware = async(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | undefined> => {
  if (req.headers.authorization) {
    const token = req.headers.authorization.split(' ')[1]
    const bearer = req.headers.authorization.split(' ')[0]

    if (bearer !== 'Bearer') {
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
  } else {
    return res.sendStatus(HTTP_STATUSES.NOT_AUTHORIZED_401)
  }
}
