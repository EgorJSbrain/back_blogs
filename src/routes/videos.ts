import { Router, Request, Response } from "express";

import { VideoService } from "../services/videos";
import { HTTP_STATUSES } from "../constants/global";
import { inputValidation } from "./utils";
import { RequestWithBody, RequestWithParams, RequestWithParamsAndBody } from "../types/global";
import { CreateVideoDto } from "../dtos/create-video.dto";
import { IVideo } from "../types/videos";
import { UpdateVideoDto } from "../dtos/update-video.dto";

export const videosRouter = Router({})

videosRouter.get('/', async (_: Request, res: Response<IVideo[]>) => {
  const videos = await VideoService.getVideos()

  if (!videos) {
    return res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
  }

  res.status(HTTP_STATUSES.OK_200).send(videos)
})

videosRouter.get('/:id', async (req: RequestWithParams<{ id: string }>, res: Response<IVideo>) => {
  const id = req.params.id

  if (!id) {
    return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
  }

  const video = await VideoService.getVideoById(Number(id))

  if (!video) {
    return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
  }

  res.status(HTTP_STATUSES.OK_200).send(video)
})

videosRouter.post('/', async (req: RequestWithBody<CreateVideoDto>, res: Response) => {
  const title = req.body.title
  const author = req.body.author
  const minAgeRestriction = req.body.minAgeRestriction
  const canBeDownloaded = req.body.canBeDownloaded
  const availableResolutions = req.body.availableResolutions

  const errors = inputValidation(title, author, availableResolutions, minAgeRestriction, canBeDownloaded)

  if (errors?.length) {
    return res.status(HTTP_STATUSES.BAD_REQUEST_400).send(
      {
        errorsMessages: errors
      }
    )
  }

  const video = await VideoService.createVideo({
    title,
    author,
    availableResolutions,
    canBeDownloaded,
    minAgeRestriction,
  })

  if (!video) {
    return res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
  }

  res.status(HTTP_STATUSES.CREATED_201).send(video)
})

videosRouter.put('/:id', async (req: RequestWithParamsAndBody<{ id: string }, UpdateVideoDto>, res: Response) => {
  const id = req.params.id

  if (!id) {
    return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
  }

  const existedVideo = await VideoService.getVideoById(Number(req.params.id))

  const title = req.body.title || existedVideo?.title || ''
  const author = req.body.author || existedVideo?.author || ''
  const minAgeRestriction = req.body.minAgeRestriction || existedVideo?.minAgeRestriction
  const canBeDownloaded = req.body.canBeDownloaded || existedVideo?.canBeDownloaded
  const availableResolutions = req.body.availableResolutions || existedVideo?.availableResolutions
  const publicationDate = req.body.publicationDate || existedVideo?.publicationDate

  const errors = inputValidation(title, author, availableResolutions, minAgeRestriction, canBeDownloaded, publicationDate)

  if (!existedVideo) {
    return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
  }

  if (errors?.length) {
    return res.status(HTTP_STATUSES.BAD_REQUEST_400).send(
      {
        errorsMessages: errors
      }
    )
  }

  const video = await VideoService.updateVideo(Number(req.params.id), req.body)

  if (!video) {
    return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
  }

  res.status(HTTP_STATUSES.NO_CONTENT_204).send(video)
})

videosRouter.delete('/:id', async (req: RequestWithParams<{ id: string }>, res: Response) => {
  const id = req.params.id

  if (!id) {
    return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
  }

  const response = await VideoService.deleteVideo(Number(req.params.id))

  if (!response) {
    return res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
  }

  res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
})