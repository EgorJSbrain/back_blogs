import { BlogsRepository } from '../repositories'
import { BlogsController } from '../controllers/blogs'
import { BlogsService } from '../services'

const blogsRepository = new BlogsRepository()
export const blogsService = new BlogsService(blogsRepository)

export const blogsController = new BlogsController(blogsService)
