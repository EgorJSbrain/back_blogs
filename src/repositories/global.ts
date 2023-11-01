import { dbClear } from '../db/mongo-db'

export class GlobalRepository {
  async deleteAll(): Promise<boolean> {
    try {
      await dbClear()

      return true
    } catch {
      return false
    }
  }
}
