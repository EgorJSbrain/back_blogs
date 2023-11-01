import { BlogsRepository } from '../repositories'
import { BlogsController } from '../controllers/blogs'
import { BlogsService } from '../services'
import { postsRepository } from './posts'

const blogsRepository = new BlogsRepository()
export const blogsService = new BlogsService(blogsRepository, postsRepository)

export const blogsController = new BlogsController(blogsService)
