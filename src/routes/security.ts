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
    res.status(HTTP_STATUSES.NO_CONTENT_204)
  }
)

securityRouter.delete(
  '/devices/:id',
  authJWTMiddleware,
  async (req: Request, res: Response) => {
    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
  }
)
