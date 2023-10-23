import { Router, Response, Request } from 'express'
import { HTTP_STATUSES } from '../constants/global'

import { authJWTMiddleware } from '../middlewares/authJWTMiddleware'
import { TokensService } from '../services'

export const securityRouter = Router({})

securityRouter.get(
  '/devices',
  authJWTMiddleware,
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
  authJWTMiddleware,
  async (req: Request, res: Response) => {
    const token = req.cookies.refreshToken

    await TokensService.deleteRefreshTokens(token)

    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
  }
)

securityRouter.delete(
  '/devices/:deviceId',
  authJWTMiddleware,
  async (req: Request<{ deviceId: string }>, res: Response) => {
    const { deviceId } = req.params

    await TokensService.deleteRefreshToken(req.userId, deviceId)

    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
  }
)
