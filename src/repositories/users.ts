import { FilterQuery, SortOrder } from 'mongoose'
import { User } from '../models'
import { SortDirections } from '../constants/global'

import { ResponseBody } from '../types/global'
import { ICreatingUser, IUser, IUserAccountData, UsersRequestParams } from '../types/users'

export class UsersRepository {
  async getUsers(params: UsersRequestParams): Promise<ResponseBody<IUserAccountData> | null> {
    try {
      const {
        sortBy = 'createdAt',
        sortDirection = SortDirections.desc,
        pageNumber = 1,
        pageSize = 10,
        searchLoginTerm,
        searchEmailTerm
      } = params

      const sort: Record<string, SortOrder> = {}
      let filter: FilterQuery<IUser> = {}

      if (searchLoginTerm) {
        filter = {
          $or: [
            { 'accountData.login': { $regex: searchLoginTerm, $options: 'i' } }
          ]
        }
      }

      if (searchEmailTerm) {
        filter = {
          $or: [...(filter.$or || []), { 'accountData.email': { $regex: searchEmailTerm, $options: 'i' } }]
        }
      }

      if (sortBy && sortDirection) {
        sort[sortBy] = sortDirection === SortDirections.asc ? 1 : -1
      }

      const pageSizeNumber = Number(pageSize)
      const pageNumberNum = Number(pageNumber)
      const skip = (pageNumberNum - 1) * pageSizeNumber
      const count = await User.countDocuments(filter)
      const pagesCount = Math.ceil(count / pageSizeNumber)

      const users = await User
        .find(filter, {
          _id: 0, passwordHash: 0, passwordSalt: 0, emailConfirmation: 0, 'accountData._id': 0
        })
        .sort(sort)
        .skip(skip)
        .limit(pageSizeNumber)
        .lean()
        .transform((doc) => doc.map(user => user.accountData))

      return {
        pagesCount,
        page: pageNumberNum,
        pageSize: pageSizeNumber,
        totalCount: count,
        items: users
      }
    } catch {
      return null
    }
  }

  async getUserByLoginOrEmail(email: string, login: string): Promise<IUser | null> {
    try {
      const user = await User.findOne(
        { $or: [{ 'accountData.email': email }, { 'accountData.login': login }] },
        { projection: { _id: 0 } }
      )

      return user
    } catch {
      return null
    }
  }

  async getUserByEmail(email: string): Promise<IUser | null> {
    try {
      const user = await User.findOne(
        { 'accountData.email': email },
        { projection: { _id: 0 } }
      )

      return user
    } catch {
      return null
    }
  }

  async getUserByData(data: Record<string, string>): Promise<IUser | null> {
    try {
      const user = await User.findOne(
        data,
        { projection: { _id: 0 } }
      )

      return user
    } catch {
      return null
    }
  }

  async getUserByVerificationCode(code: string): Promise<IUser | null> {
    try {
      const user = await User.findOne(
        { 'emailConfirmation.confirmationCode': code },
        {
          projection: {
            _id: 0,
            passwordHash: 0,
            passwordSolt: 0
          }
        }
      )

      return user
    } catch {
      return null
    }
  }

  async getUserById(id: string): Promise<IUser | null> {
    try {
      const user = await User.findOne(
        { 'accountData.id': id },
        { projection: { _id: 0, passwordHash: 0, passwordSolt: 0, 'emailConfirmation.confirmationCode': 0 } }
      )

      return user
    } catch {
      return null
    }
  }

  async createUser(data: ICreatingUser): Promise<IUser | null> {
    try {
      let user = null

      const response = await User.create(data)

      if (response._id) {
        user = await User.findOne(
          { _id: response._id },
          { projection: { _id: 0, passwordHash: 0, passwordSalt: 0, emailConfirmation: 0 } }
        ).lean()
      }

      return user
    } catch {
      return null
    }
  }

  async updateUser(id: string, data: any): Promise<IUser | null> {
    try {
      const user = await User.findOneAndUpdate(
        { 'accountData.id': id },
        data,
        { new: true, returnOriginal: false }
      )

      return user
    } catch {
      return null
    }
  }

  async deleteUser(id: string): Promise<boolean> {
    try {
      const response = await User.deleteOne({ 'accountData.id': id })

      return !!response.deletedCount
    } catch {
      return false
    }
  }
}
