import { Request } from '../models'
import { IRequest } from '../types/requests'

export const RequestsRepository = {
  async getRequests(ip: string, url: string, date: string) {
    try {
      const count = await Request.countDocuments({ ip, url, date: { $gt: date } })

      return count
    } catch {
      return null
    }
  },

  async createRequest(data: IRequest) {
    try {
      await Request.create(data)

      return true
    } catch {
      return null
    }
  }
}
