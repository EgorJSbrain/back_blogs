import { CommentsRepository } from '../repositories'
import { CommentsService } from '../services'
import { CommentsController } from '../controllers/comments'
import { usersService } from './users'
import { likesService } from './likes'

const commentsRepository = new CommentsRepository()
export const commentsService = new CommentsService(commentsRepository)

export const commentsController = new CommentsController(commentsService, usersService, likesService)
