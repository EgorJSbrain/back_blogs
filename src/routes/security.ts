import { Router, Response, Request } from 'express'
import { HTTP_STATUSES } from '../constants/global'

import { authJWTRefrshMiddleware, authMiddleware } from '../middlewares'
import { TokensService } from '../services'

export const securityRouter = Router({})

securityRouter.get(
  '/devices',
  authMiddleware,
  authJWTRefrshMiddleware,
  async (req: Request, res: Response) => {
    const tokens = await TokensService.getAllTokens(req.userId)

    if (!tokens) {
      res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    }

    res.status(HTTP_STATUSES.OK_200).send(tokens)
  }
)

securityRouter.delete(
  '/devices',
  authMiddleware,
  authJWTRefrshMiddleware,
  async (req: Request, res: Response) => {
    const token = req.cookies.refreshToken

    if (!token) {
      return res.sendStatus(HTTP_STATUSES.NOT_AUTHORIZED_401)
    }

    await TokensService.deleteRefreshTokens(token)

    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
  }
)

securityRouter.delete(
  '/devices/:deviceId',
  authMiddleware,
  authJWTRefrshMiddleware,
  async (req: Request<{ deviceId: string }>, res: Response) => {
    const { deviceId } = req.params

    if (!deviceId) {
      return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    }

    const existedToken = await TokensService.getTokenByDeviceId(deviceId, req.userId)

    if (!existedToken) {
      return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    }

    await TokensService.deleteRefreshToken(req.userId, deviceId)

    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
  }
)
