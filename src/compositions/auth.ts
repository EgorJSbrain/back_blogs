import { DevicesRepository, UsersRepository } from '../repositories'
import { AuthController } from '../controllers/auth'
import { DevicesService, UsersService } from '../services'
import { jwtService } from '../applications/jwt-service'
import { mailService } from '../domain/mail-service'

const usersRepository = new UsersRepository()
const devicesRepository = new DevicesRepository()
export const usersService = new UsersService(usersRepository)
export const devicesService = new DevicesService(devicesRepository, jwtService)

export const authController = new AuthController(usersService, devicesService, jwtService, mailService)
