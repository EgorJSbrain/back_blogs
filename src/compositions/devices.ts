import { DevicesRepository } from '../repositories'
import { DevicesService } from '../services'
import { DevicesController } from '../controllers/devices'
import { jwtService } from '../applications/jwt-service'

const devicesRepository = new DevicesRepository()
export const devicesService = new DevicesService(devicesRepository, jwtService)

export const devicesController = new DevicesController(devicesService, jwtService)
