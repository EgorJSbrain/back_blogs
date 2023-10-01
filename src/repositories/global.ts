import { dbClear } from '../db/mongo-db'

export const GlobalRepository = {
  async deleteAll() {
    try {
      await dbClear()

      return true
    } catch {
      return null
    }
  }
}
