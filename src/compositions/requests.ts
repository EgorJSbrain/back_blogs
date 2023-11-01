import { RequestsRepository } from '../repositories'
import { RequestsService } from '../services'

const requestsRepository = new RequestsRepository()
export const requestsService = new RequestsService(requestsRepository)
