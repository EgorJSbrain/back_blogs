import { DevicesRepository } from '../repositories'
import { DevicesService } from '../services'
import { DevicesController } from '../controllers/devices'

const devicesRepository = new DevicesRepository()
export const devicesService = new DevicesService(devicesRepository)

export const devicesController = new DevicesController(devicesService)
