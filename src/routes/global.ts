import { Router } from 'express'
import { globalController } from '../compositions/global'

export const globalRouter = Router({})

globalRouter.delete(
  '/all-data',
  globalController.clearDataBase.bind(globalController)
)
