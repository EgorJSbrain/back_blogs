import { NextFunction, Request, Response } from 'express'
import { HTTP_STATUSES } from '../constants/global'
import { RequestsService } from '../services'

export const requestsCountMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | undefined> => {
  if ((req.baseUrl || req.originalUrl) && req.ip) {
    const ip = req.ip
    const url = req.originalUrl || req.baseUrl

    const count = await RequestsService.getRequests(ip, url) || 0

    if (count > 5) {
      return res.sendStatus(HTTP_STATUSES.MANY_REUESTS_404)
    }

    next()
  } else {
    return res.sendStatus(HTTP_STATUSES.NOT_AUTHORIZED_401)
  }
}
