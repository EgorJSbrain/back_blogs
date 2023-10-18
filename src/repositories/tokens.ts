import { DBfields } from '../db/constants'
import { getCollection } from '../db/mongo-db'

const db = getCollection<{ token: string }>(DBfields.tokens)

export const TokensRepository = {
  async getToken(token: string) {
    try {
      const expiredToken = await db.findOne({ token }, { projection: { _id: 0 } })

      return expiredToken
    } catch {
      return null
    }
  },

  async setToken(token: string) {
    try {
      const response = await db.insertOne({ token })

      return !!response.insertedId
    } catch {
      return null
    }
  }
}
