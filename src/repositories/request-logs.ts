import { DBfields } from '../db/constants'
import { getCollection } from '../db/mongo-db'

import { IRequest } from '../types/requests'

const db = getCollection<IRequest>(DBfields.requests)

export const RequestsRepository = {
  async createRequest(data: IRequest) {
    try {
      await db.insertOne(data)

      return true
    } catch {
      return null
    }
  }
}
