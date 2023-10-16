import { Filter, Sort } from 'mongodb'
import { DBfields } from '../db/constants'
import { getCollection } from '../db/mongo-db'
import { SortDirections } from '../constants/global'

import { ResponseBody } from '../types/global'
import { ICreatingUser, IUser, UsersRequestParams } from '../types/users'

const db = getCollection<IUser>(DBfields.users)

export const UsersRepository = {
  async getUsers(params: UsersRequestParams): Promise<ResponseBody<IUser> | null> {
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
      let filter: Filter<IUser> = {}

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
      const count = await db.countDocuments(filter)
      const pagesCount = Math.ceil(count / pageSizeNumber)

      const users = await db
        .find(filter, {
          projection: {
            _id: 0,
            passwordHash: 0,
            passwordSalt: 0,
            'emailConfirmation.confirmationCode': 0
          }
        })
        .sort(sort)
        .skip(skip)
        .limit(pageSizeNumber)
        .toArray()

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
      const user = await db.findOne(
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
      const user = await db.findOne(
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
      const user = await db.findOne(
        { 'emailConfirmation.confirmationCode': code },
        {
          projection: {
            _id: 0,
            passwordHash: 0,
            passwordSolt: 0
            // 'emailConfirmation.confirmationCode': 0
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
      const user = await db.findOne(
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

      const response = await db.insertOne(data)

      if (response.insertedId) {
        user = await db.findOne(
          { 'accountData.id': data.accountData.id },
          { projection: { _id: 0, passwordHash: 0, passwordSalt: 0, 'emailConfirmation.confirmationCode': 0 } }
        )
      }

      return user
    } catch {
      return null
    }
  },

  async updateUser(id: string, data: IUser) {
    try {
      const user = await db.findOneAndUpdate(
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
      const response = await db.deleteOne({ 'accountData.id': id })

      return !!response.deletedCount
    } catch {
      return null
    }
  }
}
