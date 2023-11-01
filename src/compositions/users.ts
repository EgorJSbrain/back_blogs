import { UsersRepository } from '../repositories'
import { UsersController } from '../controllers/users'
import { UsersService } from '../services'

const usersRepository = new UsersRepository()
export const usersService = new UsersService(usersRepository)

export const usersController = new UsersController(usersService)
