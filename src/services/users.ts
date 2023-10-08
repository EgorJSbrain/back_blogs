import { generateNewUser } from './utils'
import { UsersRepository } from '../repositories'
import { RequestParams } from '../types/global'
import { CreateUserDto } from '../dtos/users/create-user.dto'

export const UsersService = {
  async getUsers(params: RequestParams) {
    return await UsersRepository.getUsers(params)
  },

  async getUserByLoginOrEmail(login: string, email: string) {
    return await UsersRepository.getuserByLoginOrEmail(login, email)
  },

  async createUser(data: CreateUserDto) {
    const createdUser = await generateNewUser(data)

    return await UsersRepository.createUser(createdUser)
  },

  async deleteUser(id: string) {
    return await UsersRepository.deleteUser(id)
  }
}
