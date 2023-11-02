import { NextFunction, Request, Response } from 'express'
import { HTTP_STATUSES } from '../constants/global'
import { jwtService } from '../applications/jwt-service'

export const authJWTMiddleware = async(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<undefined> => {
  if (req.headers.authorization) {
    const token = req.headers.authorization.split(' ')[1]
    const bearer = req.headers.authorization.split(' ')[0]

    if (bearer !== 'Bearer') {
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
  } else {
    res.sendStatus(HTTP_STATUSES.NOT_AUTHORIZED_401)
  }
}
