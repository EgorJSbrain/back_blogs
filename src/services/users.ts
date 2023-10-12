import bcrypt from 'bcrypt'

import { generateNewUser } from './utils'
import { UsersRepository } from '../repositories'
import { RequestParams } from '../types/global'
import { CreateUserDto } from '../dtos/users/create-user.dto'

export const UsersService = {
  async getUsers(params: RequestParams) {
    return await UsersRepository.getUsers(params)
  },

  async getUserById(id: string) {
    return await UsersRepository.getUserById(id)
  },

  async getUserByLoginOrEmail(login: string, email: string) {
    return await UsersRepository.getUserByLoginOrEmail(login, email)
  },

  async checkCredentials(loginOrEmail: string, password: string) {
    const existedUser = await UsersRepository.getUserByLoginOrEmail(loginOrEmail, loginOrEmail)

    if (existedUser && existedUser.passwordHash) {
      const passwordChecked = await bcrypt.compare(password, existedUser.passwordHash)

      if (passwordChecked) {
        return existedUser
      } else {
        return null
      }
    }

    return null
  },

  async createUser(data: CreateUserDto) {
    const { passwordSalt, passwordHash } = await this._generateHash(data.password)
    const createdUser = await generateNewUser(data, passwordSalt, passwordHash)

    return await UsersRepository.createUser(createdUser)
  },

  async deleteUser(id: string) {
    return await UsersRepository.deleteUser(id)
  },

  async _generateHash(password: string) {
    const passwordSalt = await bcrypt.genSalt(10)
    const passwordHash = await bcrypt.hash(password, passwordSalt)

    return {
      passwordSalt,
      passwordHash
    }
  }
}
