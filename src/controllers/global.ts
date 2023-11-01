import { Response } from 'express'
import { GlobalService } from '../services'
import { HTTP_STATUSES } from '../constants/global'

export class GlobalController {
  constructor(protected globalService: GlobalService) {}

  async clearDataBase(_: Request, res: Response): Promise<undefined> {
    const response = await this.globalService.deleteAll()

    if (!response) {
      res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
      return
    }

    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
  }
}
