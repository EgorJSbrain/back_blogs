import { Request } from '../types/requests'
import { CreateRequestDto } from '../dtos/requests/create-request.dto'
import { RequestsRepository } from '../repositories'
import sub from 'date-fns/sub'

export class RequestsService {
  constructor(protected requestsRepository: RequestsRepository) {}
  async getRequests(ip: string, url: string): Promise<number | null> {
    const date = sub(new Date(), {
      seconds: 10
    }).toISOString()

    return await this.requestsRepository.getRequests(ip, url, date)
  }

  async createRequest(data: CreateRequestDto): Promise<boolean> {
    const createdRequest = new Request(data.ip, data.url)

    return await this.requestsRepository.createRequest(createdRequest)
  }
}
