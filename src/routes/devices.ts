import { Router } from 'express'

import { authJWTRefrshMiddleware } from '../middlewares'
import { devicesController } from '../compositions/devices'

export const devicesRouter = Router({})

devicesRouter.get(
  '/devices',
  authJWTRefrshMiddleware,
  devicesController.getAllDevices.bind(devicesController)
)

devicesRouter.delete(
  '/devices',
  authJWTRefrshMiddleware,
  devicesController.deleteDevices.bind(devicesController)
)

devicesRouter.delete(
  '/devices/:deviceId',
  devicesController.deleteDevice.bind(devicesController)
)
