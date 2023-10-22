import { generateNewReuest } from './utils'
import { CreateRequestDto } from '../dtos/requests/create-request.dto'
import { RequestsRepository } from '../repositories/request-logs'

export const RequestsService = {
  async createRequest(data: CreateRequestDto) {
    const createdRequest = generateNewReuest(data)

    return await RequestsRepository.createRequest(createdRequest)
  }
}
