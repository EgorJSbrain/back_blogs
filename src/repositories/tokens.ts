import { DBfields } from '../db/constants'
import { getCollection } from '../db/mongo-db'
import { IRefreshTokenMeta } from '../types/tokens'

const db = getCollection<IRefreshTokenMeta>(DBfields.tokens)

export const TokensRepository = {
  async getAllTokenByUserId(userId: string) {
    try {
      const tokens = await db.find({ userId }, { projection: { _id: 0, expiredDate: 0, userId: 0 } }).toArray()

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

  async getTokenByDeviceId(deviceId: string, deviceTitle: string) {
    try {
      const token = await db.findOne({ deviceId }, { projection: { _id: 0 } })

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

  async updateRefreshToken(prevDate: string, currentDate: string, newExpiredDate: string) {
    try {
      let updatedToken
      const response = await db.updateOne(
        { lastActiveDate: prevDate },
        { $set: { lastActiveDate: currentDate, expiredDate: newExpiredDate } }
      )

      if (response.modifiedCount) {
        updatedToken = await db.findOne({ lastActiveDate: currentDate }, { projection: { _id: 0 } })
      }

      return updatedToken
    } catch {
      return null
    }
  },

  async deleteRefreshTokens(userId: string, lastActiveDate: string) {
    try {
      const response = await db.deleteMany({ userId, $nor: [{ lastActiveDate }] })

      return !!response.deletedCount
    } catch {
      return null
    }
  },

  async deleteRefreshToken(userId: string, deviceId: string) {
    try {
      const response = await db.deleteOne({ userId, deviceId })

      return !!response.deletedCount
    } catch {
      return null
    }
  }
}
