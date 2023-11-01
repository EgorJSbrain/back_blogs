import { Router, Response, Request } from 'express'
import { HTTP_STATUSES } from '../constants/global'

import { authJWTRefrshMiddleware } from '../middlewares'
import { TokensService } from '../services'
import { JwtService } from '../applications/jwt-service'

export const securityRouter = Router({})

securityRouter.get(
  '/devices',
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

// securityRouter.delete(
//   '/devices/:deviceId',
//   async (req: Request<{ deviceId: string }>, res: Response) => {
//     const { deviceId } = req.params
//     const token = req.cookies.refreshToken ?? ''
//     const deviceTitle = req.headers['user-agent'] ?? ''

//     if (!deviceId) {
//       return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
//     }

//     if (!token) {
//       return res.sendStatus(HTTP_STATUSES.NOT_AUTHORIZED_401)
//     }

//     const userId = await JwtService.verifyExperationToken(token)
//     const existedToken = await TokensService.getTokenByDeviceId(deviceId, deviceTitle)

//     if (!existedToken) {
//       return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
//     }

//     if (existedToken?.userId !== userId) {
//       return res.sendStatus(HTTP_STATUSES.FORBIDEN_403)
//     }

//     if (!userId) {
//       return res.sendStatus(HTTP_STATUSES.NOT_AUTHORIZED_401)
//     }

//     await TokensService.deleteRefreshToken(deviceId)

//     res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
//   }
// )
