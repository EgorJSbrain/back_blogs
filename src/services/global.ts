import { dbClear } from '../db/mongo-db'

export const GlobalService = {
  async deleteAll() {
    try {
      await dbClear()

      return true
    } catch {
      return null
    }
  }
}
