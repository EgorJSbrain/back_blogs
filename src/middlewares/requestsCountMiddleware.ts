import { NextFunction, Request, Response } from 'express'
import { HTTP_STATUSES } from '../constants/global'
import { requestsService } from '../compositions/requests'

export const requestsCountMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | undefined> => {
  if ((req.baseUrl || req.originalUrl) && req.ip) {
    const ip = req.ip
    const url = req.originalUrl || req.baseUrl

    const count = await requestsService.getRequests(ip, url) || 0

    if (count > 4) {
      return res.sendStatus(HTTP_STATUSES.MANY_REQUESTS_429)
    }

    next()
  } else {
    return res.sendStatus(HTTP_STATUSES.NOT_AUTHORIZED_401)
  }
}
