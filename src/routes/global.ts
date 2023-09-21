import { Router, Request, Response } from 'express'
import { GlobalService } from '../services'
import { HTTP_STATUSES } from '../constants/global'

export const globalRouter = Router({})

globalRouter.delete('/all-data', async (req: Request, res: Response) => {
  const response = await GlobalService.deleteAll()

  if (!response) {
    return res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
  }

  res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
})
