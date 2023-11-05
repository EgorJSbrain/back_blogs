import { LikesRepository } from '../repositories/likes'
import { LikesService } from '../services/likes'

export const likesRepository = new LikesRepository()
export const likesService = new LikesService(likesRepository)

// export const videosController = new VideosController(videosService)
