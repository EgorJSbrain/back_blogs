import { CommentsRepository } from '../repositories'
import { CommentsService } from '../services'
import { CommentsController } from '../controllers/comments'
import { usersService } from './users'
import { likesService } from './likes'
import { jwtService } from '../applications/jwt-service'

const commentsRepository = new CommentsRepository()
export const commentsService = new CommentsService(commentsRepository, likesService)

export const commentsController = new CommentsController(
  commentsService,
  usersService,
  jwtService,
  likesService
)
