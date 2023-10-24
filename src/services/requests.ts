import { generateNewReuest } from './utils'
import { CreateRequestDto } from '../dtos/requests/create-request.dto'
import { RequestsRepository } from '../repositories'
import sub from 'date-fns/sub'

export const RequestsService = {
  async getRequests(ip: string, url: string) {
    const date = sub(new Date(), {
      seconds: 10
    }).toISOString()

    return await RequestsRepository.getRequests(ip, url, date)
  },

  async createRequest(data: CreateRequestDto) {
    const createdRequest = generateNewReuest(data)

    return await RequestsRepository.createRequest(createdRequest)
  }
}
