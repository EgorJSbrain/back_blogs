import bcrypt from 'bcrypt'
import { v4 } from 'uuid'
import add from 'date-fns/add'

import { UsersRepository } from '../repositories'

import { RequestParams } from '../types/global'
import { CreateUserDto } from '../dtos/users/create-user.dto'
import { IUser, User } from '../types/users'

export class UsersService {
  constructor (protected usersRepository: UsersRepository) {}

  async getUsers(params: RequestParams): Promise<any> {
    return await this.usersRepository.getUsers(params)
  }

  async getUserById(id: string): Promise<IUser | null> {
    return await this.usersRepository.getUserById(id)
  }

  async getUserByLoginOrEmail(email: string, login: string): Promise<any> {
    return await this.usersRepository.getUserByLoginOrEmail(email, login)
  }

  async getUserByEmail(email: string): Promise<any> {
    return await this.usersRepository.getUserByEmail(email)
  }

  async getUserByRecoveryCode(code: string): Promise<any> {
    return await this.usersRepository.getUserByData({ 'userSecurity.recoveryPasswordCode': code })
  }

  async getUserByVerificationCode(code: string): Promise<IUser | null> {
    return await this.usersRepository.getUserByVerificationCode(code)
  }

  async updateUserWithNewConfirmatioCode(data: IUser): Promise<any> {
    return await this.updateUser(data.accountData.id, {
      'emailConfirmation.expirationDate': add(new Date(), {
        hours: 1,
        minutes: 10
      }),
      'emailConfirmation.confirmationCode': v4()
    })
  }

  async updateUserWithNewRecoveryPasswordCode(data: IUser): Promise<any> {
    return await this.updateUser(data.accountData.id, { 'userSecurity.recoveryPasswordCode': v4() })
  }

  async confirmUserEmail(data: IUser): Promise<any> {
    return await this.updateUser(data.accountData.id, { 'emailConfirmation.isConfirmed': true })
  }

  async updateUser(id: string, data: any): Promise<any> {
    return await this.usersRepository.updateUser(id, data)
  }

  async checkCredentials(loginOrEmail: string, password: string): Promise<any> {
    const existedUser = await this.usersRepository.getUserByLoginOrEmail(loginOrEmail, loginOrEmail)

    if (existedUser?.passwordHash) {
      const passwordChecked = await bcrypt.compare(password, existedUser.passwordHash)

      if (passwordChecked) {
        return existedUser
      } else {
        return null
      }
    }

    return null
  }

  async createUser(data: CreateUserDto, isConfirmed?: boolean): Promise<any> {
    const { passwordSalt, passwordHash } = await this._generateHash(data.password)
    const createdUser = new User(data.login, data.email, passwordSalt, passwordHash, isConfirmed)

    return await this.usersRepository.createUser(createdUser)
  }

  async updatePasswordUser(userId: string, newPassword: string): Promise<any> {
    const { passwordSalt, passwordHash } = await this._generateHash(newPassword)

    return await this.updateUser(userId, { passwordSalt, passwordHash })
  }

  async deleteUser(id: string): Promise<any> {
    return await this.usersRepository.deleteUser(id)
  }

  async _generateHash(password: string): Promise<any> {
    const passwordSalt = await bcrypt.genSalt(10)
    const passwordHash = await bcrypt.hash(password, passwordSalt)

    return {
      passwordSalt,
      passwordHash
    }
  }
}

// export const UsersService = {
//   async getUsers(params: RequestParams) {
//     return await UsersRepository.getUsers(params)
//   },

//   async getUserById(id: string) {
//     return await UsersRepository.getUserById(id)
//   },

//   async getUserByLoginOrEmail(email: string, login: string) {
//     return await UsersRepository.getUserByLoginOrEmail(email, login)
//   },

//   async getUserByEmail(email: string) {
//     return await UsersRepository.getUserByEmail(email)
//   },

//   async getUserByRecoveryCode(code: string) {
//     return await UsersRepository.getUserByData({ 'userSecurity.recoveryPasswordCode': code })
//   },

//   async getUserByVerificationCode(code: string) {
//     return await UsersRepository.getUserByVerificationCode(code)
//   },

//   async updateUserWithNewConfirmatioCode(data: IUser) {
//     return await this.updateUser(data.accountData.id, {
//       'emailConfirmation.expirationDate': add(new Date(), {
//         hours: 1,
//         minutes: 10
//       }),
//       'emailConfirmation.confirmationCode': v4()
//     })
//   },

//   async updateUserWithNewRecoveryPasswordCode(data: IUser) {
//     return await this.updateUser(data.accountData.id, { 'userSecurity.recoveryPasswordCode': v4() })
//   },

//   async confirmUserEmail(data: IUser) {
//     return await this.updateUser(data.accountData.id, { 'emailConfirmation.isConfirmed': true })
//   },

//   async updateUser(id: string, data: any) {
//     return await UsersRepository.updateUser(id, data)
//   },

//   async checkCredentials(loginOrEmail: string, password: string) {
//     const existedUser = await UsersRepository.getUserByLoginOrEmail(loginOrEmail, loginOrEmail)

//     if (existedUser && existedUser.passwordHash) {
//       const passwordChecked = await bcrypt.compare(password, existedUser.passwordHash)

//       if (passwordChecked) {
//         return existedUser
//       } else {
//         return null
//       }
//     }

//     return null
//   },

//   async createUser(data: CreateUserDto, isConfirmed?: boolean) {
//     const { passwordSalt, passwordHash } = await this._generateHash(data.password)
//     const createdUser = new User(data.login, data.email, passwordSalt, passwordHash, isConfirmed)

//     return await UsersRepository.createUser(createdUser)
//   },

//   async updatePasswordUser(userId: string, newPassword: string) {
//     const { passwordSalt, passwordHash } = await this._generateHash(newPassword)

//     return await this.updateUser(userId, { passwordSalt, passwordHash })
//   },

//   async deleteUser(id: string) {
//     return await UsersRepository.deleteUser(id)
//   },

//   async _generateHash(password: string) {
//     const passwordSalt = await bcrypt.genSalt(10)
//     const passwordHash = await bcrypt.hash(password, passwordSalt)

//     return {
//       passwordSalt,
//       passwordHash
//     }
//   }
// }
