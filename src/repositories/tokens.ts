import { Token } from '../models'
import { IRefreshTokenMeta } from '../types/tokens'

export const TokensRepository = {
  async getAllTokenByUserId(userId: string) {
    try {
      const tokens = await Token
        .find({ userId }, { projection: { _id: 0, expiredDate: 0, userId: 0 } })
        .lean()

      return tokens
    } catch {
      return null
    }
  },

  async getTokenByDate(lastActiveDate: string) {
    try {
      const token = await Token.findOne({ lastActiveDate }, { projection: { _id: 0 } })

      return token
    } catch {
      return null
    }
  },

  async getTokenByDeviceId(deviceId: string, deviceTitle: string) {
    try {
      const token = await Token.findOne({ deviceId }, { projection: { _id: 0 } })

      return token
    } catch {
      return null
    }
  },

  async createRefreshToken(token: IRefreshTokenMeta) {
    try {
      const response = await Token.create(token)

      return !!response._id
    } catch {
      return null
    }
  },

  async updateRefreshToken(prevDate: string, currentDate: string, newExpiredDate: string) {
    try {
      let updatedToken
      const response = await Token.updateOne(
        { lastActiveDate: prevDate },
        { $set: { lastActiveDate: currentDate, expiredDate: newExpiredDate } }
      )

      if (response.modifiedCount) {
        updatedToken = await Token.findOne({ lastActiveDate: currentDate }, { projection: { _id: 0 } })
      }

      return updatedToken
    } catch {
      return null
    }
  },

  async deleteRefreshTokens(userId: string, lastActiveDate: string) {
    try {
      const response = await Token.deleteMany({ userId, $nor: [{ lastActiveDate }] })

      return !!response.deletedCount
    } catch {
      return null
    }
  },

  async deleteRefreshToken(deviceId: string) {
    try {
      const response = await Token.deleteOne({ deviceId })

      return !!response.deletedCount
    } catch {
      return null
    }
  }
}
