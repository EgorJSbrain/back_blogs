import { Response, Request } from 'express'
import { DevicesService } from '../services'

import { HTTP_STATUSES } from '../constants/global'
import { JwtService } from '../applications/jwt-service'

export class DevicesController {
  constructor(
    protected devicesService: DevicesService,
    protected jwtService: JwtService
  ) {}

  async getAllDevices (req: Request, res: Response): Promise<undefined> {
    const tokens = await this.devicesService.getAllDevices(req.userId)

    if (!tokens) {
      res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
      return
    }

    res.status(HTTP_STATUSES.OK_200).send(tokens)
  }

  async deleteDevices (req: Request, res: Response): Promise<undefined> {
    const token = req.cookies.refreshToken

    if (!token) {
      res.sendStatus(HTTP_STATUSES.NOT_AUTHORIZED_401)
      return
    }

    await this.devicesService.deleteDevices(token)

    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
  }

  async deleteDevice (req: Request<{ deviceId: string }>, res: Response): Promise<undefined> {
    const { deviceId } = req.params
    const token = req.cookies.refreshToken ?? ''
    // const deviceTitle = req.headers['user-agent'] ?? ''

    if (!deviceId) {
      res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
      return
    }

    if (!token) {
      res.sendStatus(HTTP_STATUSES.NOT_AUTHORIZED_401)
      return
    }

    const userId = await this.jwtService.verifyExperationToken(token)
    const existedToken = await this.devicesService.getDeviceByDeviceId(deviceId)

    if (!existedToken) {
      res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
      return
    }

    if (existedToken?.userId !== userId) {
      res.sendStatus(HTTP_STATUSES.FORBIDEN_403)
      return
    }

    if (!userId) {
      res.sendStatus(HTTP_STATUSES.NOT_AUTHORIZED_401)
      return
    }

    await this.devicesService.deleteDevice(deviceId)

    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
  }
}
