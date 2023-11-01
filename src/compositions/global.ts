import { GlobalRepository } from '../repositories'
import { GlobalService } from '../services'
import { GlobalController } from '../controllers/global'

const globalRepository = new GlobalRepository()
const globalService = new GlobalService(globalRepository)

export const globalController = new GlobalController(globalService)
