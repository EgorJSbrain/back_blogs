import { UsersRepository } from '../repositories'
import { AuthController } from '../controllers/auth'
import { UsersService } from '../services'
import { devicesService } from './devices'

const usersRepository = new UsersRepository()
export const usersService = new UsersService(usersRepository)

export const authController = new AuthController(usersService, devicesService)
