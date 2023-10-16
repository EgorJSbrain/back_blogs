import bcrypt from 'bcrypt'

import { generateNewUser } from './utils'
import { UsersRepository } from '../repositories'

import { RequestParams } from '../types/global'
import { CreateUserDto } from '../dtos/users/create-user.dto'
import { IUser } from '../types/users'

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

  async getUserByVerificationCode(code: string) {
    return await UsersRepository.getUserByVerificationCode(code)
  },

  async updateUser(id: string, data: IUser) {
    return await UsersRepository.updateUser(id, data)
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

  async createUser(data: CreateUserDto, isConfirmed?: boolean) {
    const { passwordSalt, passwordHash } = await this._generateHash(data.password)
    const createdUser = generateNewUser(data, passwordSalt, passwordHash, isConfirmed)

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
