import { Request } from '../models'
import { IRequest } from '../types/requests'

export class RequestsRepository {
  async getRequests(ip: string, url: string, date: string): Promise<number | null> {
    try {
      const count = await Request.countDocuments({ ip, url, date: { $gt: date } })

      return count
    } catch {
      return null
    }
  }

  async createRequest(data: IRequest): Promise<boolean> {
    try {
      await Request.create(data)

      return true
    } catch {
      return false
    }
  }
}
