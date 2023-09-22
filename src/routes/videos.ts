import { Router, Request, Response } from 'express'

import { VideosService } from '../services/videos'
import { HTTP_STATUSES } from '../constants/global'
import { VideoInputFields } from '../constants/videos'
import { inputValidation } from './utils'
import {
  RequestWithBody,
  RequestWithParams,
  RequestWithParamsAndBody
} from '../types/global'
import { IVideo } from '../types/videos'
import { CreateVideoDto } from '../dtos/videos/create-video.dto'
import { UpdateVideoDto } from '../dtos/videos/update-video.dto'

export const videosRouter = Router({})

videosRouter.get('/', async (_: Request, res: Response<IVideo[]>) => {
  const videos = await VideosService.getVideos()

  if (!videos) {
    return res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
  }

  res.status(HTTP_STATUSES.OK_200).send(videos)
})

videosRouter.get(
  '/:id',
  async (req: RequestWithParams<{ id: string }>, res: Response<IVideo>) => {
    const { id } = req.params

    if (!id) {
      return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    }

    const video = await VideosService.getVideoById(Number(id))

    if (!video) {
      return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    }

    res.status(HTTP_STATUSES.OK_200).send(video)
  }
)

videosRouter.post(
  '/',
  async (req: RequestWithBody<CreateVideoDto>, res: Response) => {
    const { title, author, minAgeRestriction, canBeDownloaded, availableResolutions } = req.body
    const creatingData = {
      [VideoInputFields.title]: title,
      [VideoInputFields.author]: author,
      [VideoInputFields.minAgeRestriction]: minAgeRestriction,
      [VideoInputFields.canBeDownloaded]: canBeDownloaded,
      [VideoInputFields.availableResolutions]: availableResolutions
    }

    const errors = inputValidation(creatingData)

    if (errors?.length) {
      return res.status(HTTP_STATUSES.BAD_REQUEST_400).send({
        errorsMessages: errors
      })
    }

    const video = await VideosService.createVideo(creatingData)

    if (!video) {
      return res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
    }

    res.status(HTTP_STATUSES.CREATED_201).send(video)
  }
)

videosRouter.put(
  '/:id',
  async (
    req: RequestWithParamsAndBody<{ id: string }, UpdateVideoDto>,
    res: Response
  ) => {
    const { id } = req.params
    const {
      title,
      author,
      minAgeRestriction,
      canBeDownloaded,
      availableResolutions,
      publicationDate
    } = req.body

    if (!id) {
      return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    }

    const existedVideo = await VideosService.getVideoById(Number(id))

    if (!existedVideo) {
      return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    }

    const updatedVideo = {
      [VideoInputFields.title]: Object.prototype.hasOwnProperty.call(
        req.body,
        VideoInputFields.title
      )
        ? title || ''
        : existedVideo?.title,
      [VideoInputFields.author]: Object.prototype.hasOwnProperty.call(
        req.body,
        VideoInputFields.author
      )
        ? author || ''
        : existedVideo?.author,
      [VideoInputFields.minAgeRestriction]:
        Object.prototype.hasOwnProperty.call(
          req.body,
          VideoInputFields.minAgeRestriction
        )
          ? minAgeRestriction
          : existedVideo?.minAgeRestriction || null,
      [VideoInputFields.canBeDownloaded]: Object.prototype.hasOwnProperty.call(
        req.body,
        VideoInputFields.canBeDownloaded
      )
        ? canBeDownloaded
        : existedVideo?.canBeDownloaded,
      [VideoInputFields.availableResolutions]: Object.prototype.hasOwnProperty.call(
        req.body,
        VideoInputFields.availableResolutions
      )
        ? availableResolutions
        : existedVideo?.availableResolutions,
      [VideoInputFields.publicationDate]: Object.prototype.hasOwnProperty.call(
        req.body,
        VideoInputFields.publicationDate
      )
        ? publicationDate
        : existedVideo?.publicationDate
    }

    const errors = inputValidation(updatedVideo)

    if (errors?.length) {
      return res.status(HTTP_STATUSES.BAD_REQUEST_400).send({
        errorsMessages: errors
      })
    }

    const video = await VideosService.updateVideo(Number(id), updatedVideo)

    if (!video) {
      return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    }

    res.status(HTTP_STATUSES.NO_CONTENT_204).send(video)
  }
)

videosRouter.delete(
  '/:id',
  async (req: RequestWithParams<{ id: string }>, res: Response) => {
    const { id } = req.params

    if (!id) {
      return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    }

    const response = await VideosService.deleteVideo(Number(id))

    if (!response) {
      return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
    }

    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
  }
)
