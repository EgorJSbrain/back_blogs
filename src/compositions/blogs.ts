import { BlogsRepository } from '../repositories'
import { BlogsController } from '../controllers/blogs'
import { BlogsService } from '../services'
import { postsService } from './posts'
import { jwtService } from '../applications/jwt-service'

const blogsRepository = new BlogsRepository()
export const blogsService = new BlogsService(blogsRepository, postsService)

export const blogsController = new BlogsController(blogsService, postsService, jwtService)
