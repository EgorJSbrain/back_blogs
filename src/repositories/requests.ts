import { DBfields } from '../db/constants'
import { getCollection } from '../db/mongo-db'

import { IRequest } from '../types/requests'

const db = getCollection<IRequest>(DBfields.requests)

export const RequestsRepository = {
  async getRequests(ip: string, url: string, date: string) {
    try {
      const count = await db.countDocuments({ ip, url, date: { $gt: date } })

      return count
    } catch {
      return null
    }
  },

  async createRequest(data: IRequest) {
    try {
      await db.insertOne(data)

      return true
    } catch {
      return null
    }
  }
}
