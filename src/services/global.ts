import { db } from "../db/db"

export const GlobalService = {
  async deleteAll () {
    
    try {
      db(true)

      return true
    } catch {
      return null
    }
  }
}
