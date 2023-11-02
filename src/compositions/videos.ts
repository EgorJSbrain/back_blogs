import { VideosRepository } from '../repositories'
import { VideosService } from '../services'
import { VideosController } from '../controllers/videos'

const videosRepository = new VideosRepository()
export const videosService = new VideosService(videosRepository)

export const videosController = new VideosController(videosService)
