import { Sort } from 'mongodb'
import { SortDirections } from '../constants/global'

import { ResponseBody } from '../types/global'
import { ICreatingUser, IUser, IUserAccountData, UsersRequestParams } from '../types/users'
import { User } from '../models/users'
import { FilterQuery } from 'mongoose'

export const UsersRepository = {
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

      const sort: Sort = {}
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
  },

  async getUserByLoginOrEmail(email: string, login: string) {
    try {
      const user = await User.findOne(
        { $or: [{ 'accountData.email': email }, { 'accountData.login': login }] },
        { projection: { _id: 0 } }
      )

      return user
    } catch {
      return null
    }
  },

  async getUserByEmail(email: string) {
    try {
      const user = await User.findOne(
        { 'accountData.email': email },
        { projection: { _id: 0 } }
      )

      return user
    } catch {
      return null
    }
  },

  async getUserByVerificationCode(code: string) {
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
  },

  async getUserById(id: string) {
    try {
      const user = await User.findOne(
        { 'accountData.id': id },
        { projection: { _id: 0, passwordHash: 0, passwordSolt: 0, 'emailConfirmation.confirmationCode': 0 } }
      )

      return user
    } catch {
      return null
    }
  },

  async createUser(data: ICreatingUser) {
    try {
      let user

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
  },

  async updateUser(id: string, data: IUser) {
    try {
      const user = await User.findOneAndUpdate(
        { 'accountData.id': id },
        { $set: data }
      )

      return user
    } catch {
      return null
    }
  },

  async deleteUser(id: string) {
    try {
      const response = await User.deleteOne({ 'accountData.id': id })

      return !!response.deletedCount
    } catch {
      return null
    }
  }
}
