import { Router } from 'express'

import { validationMiddleware } from '../middlewares/validationMiddleware'
import { VideoCreateValidation, VideoUpdateValidation } from '../utils/validation/inputValidations'
import { videosController } from '../compositions/videos'

export const videosRouter = Router({})

videosRouter.get('/', videosController.getVideos.bind(videosController))
videosRouter.get('/:id', videosController.getVideoById.bind(videosController))

videosRouter.post(
  '/',
  VideoCreateValidation(),
  validationMiddleware,
  videosController.createVideo.bind(videosController)
)

videosRouter.put(
  '/:id',
  VideoUpdateValidation(),
  validationMiddleware,
  videosController.updateVideo.bind(videosController)
)

videosRouter.delete(
  '/:id',
  videosController.deleteVideo.bind(videosController)
)
