import { BlogsRepository, PostsRepository } from '../repositories'
import { BlogsService, PostsService } from '../services'
import { PostsController } from '../controllers/posts'
import { commentsService } from './comments'
import { usersService } from './users'

export const postsRepository = new PostsRepository()
export const blogsRepository = new BlogsRepository()
export const postsService = new PostsService(postsRepository)
export const blogsService = new BlogsService(blogsRepository, postsRepository)

export const postsController = new PostsController(
  postsService,
  blogsService,
  commentsService,
  usersService
)
