import { NextFunction, Request, Response } from 'express'
import { HTTP_STATUSES } from '../constants/global'
import { requestsService } from '../compositions/requests'

export const requestLogMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | undefined> => {
  if ((req.baseUrl || req.originalUrl) && req.ip) {
    await requestsService.createRequest({
      ip: req.ip,
      url: req.originalUrl || req.baseUrl
    })

    next()
  } else {
    return res.sendStatus(HTTP_STATUSES.NOT_AUTHORIZED_401)
  }
}
