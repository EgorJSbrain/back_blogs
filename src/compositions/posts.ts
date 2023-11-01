import { PostsRepository } from '../repositories'
import { PostsService } from '../services'
import { PostsController } from '../controllers/posts'
import { blogsService } from './blogs'
import { commentsService } from './comments'
import { usersService } from './users'

export const postsRepository = new PostsRepository()
export const postsService = new PostsService(postsRepository)

export const postsController = new PostsController(
  postsService,
  blogsService,
  commentsService,
  usersService
)
