import { DBfields } from '../db/constants'
import { getCollection } from '../db/mongo-db'
import { IRefreshTokenMeta } from '../types/tokens'

const db = getCollection<IRefreshTokenMeta>(DBfields.tokens)

export const TokensRepository = {
  async getAllTokenByUserId(userId: string) {
    try {
      const tokens = await db.find({ userId }, { projection: { _id: 0 } }).toArray()

      return tokens
    } catch {
      return null
    }
  },

  async getTokenByDate(lastActiveDate: string) {
    try {
      const token = await db.findOne({ lastActiveDate }, { projection: { _id: 0 } })

      return token
    } catch {
      return null
    }
  },

  async createRefreshToken(token: IRefreshTokenMeta) {
    try {
      const response = await db.insertOne(token)

      return !!response.insertedId
    } catch {
      return null
    }
  },

  async updateRefreshToken(prevDate: string, currentDate: string) {
    try {
      let updatedToken
      const response = await db.updateOne({ lastActiveDate: prevDate }, { $set: { lastActiveDate: currentDate } })

      if (response.modifiedCount) {
        updatedToken = await db.findOne({ lastActiveDate: currentDate }, { projection: { _id: 0 } })
      }

      return updatedToken
    } catch {
      return null
    }
  },

  async deleteRefreshTokens(dates: string[]) {
    try {
      const response = await db.deleteMany({ lastActiveDate: dates })

      return !!response.deletedCount
    } catch {
      return null
    }
  }
}
