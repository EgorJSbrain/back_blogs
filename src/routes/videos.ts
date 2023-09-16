import { Router, Request, Response } from "express";
import { VideoService } from "../services/videos";
import { CodeResponseEnum } from "../constants/global";
import {
  VideoAvailableResolutions,
  VideoInputFields,
  videoAvailableResolutions,
  errorMessage
} from "../constants/videos";

export const videosRouter = Router({})

type Error = {
  message: string
  field: string
}

const errorConstructor = (field: string, message: string): Error => ({
  message,
  field
})

// TO DO
// add param like options { field: '', message: '' }

const inputValidation = (title: string, author: string, availableResolutions: VideoAvailableResolutions[] | null) => {
  const errors: Error[] = []

  const includeUnavailableResolution = availableResolutions && availableResolutions.every(availableResolution =>
    videoAvailableResolutions.includes(availableResolution)
  )

  if (!title || !author || !includeUnavailableResolution || !availableResolutions) {
    if (!title) {
      errors.push(errorConstructor(VideoInputFields.title, errorMessage.title))
    } 

    if (!author) {
      errors.push(errorConstructor(VideoInputFields.author, errorMessage.author))
    }

    if (!availableResolutions) {
      errors.push(errorConstructor(VideoInputFields.availableResolutions, errorMessage.availableResolutionsRequired))
    }

    if (!includeUnavailableResolution && availableResolutions) {
      errors.push(errorConstructor(
        VideoInputFields.availableResolutions,
        errorMessage.availableResolutions
      ))
    }

  }

  return errors
}

videosRouter.get('/', async (req: Request, res: Response) => {
  const videos = await VideoService.getVideos()

  if (!videos) {
    return res.sendStatus(CodeResponseEnum.BAD_REQUEST_400)
  }

  res.status(CodeResponseEnum.OK_200).send(videos)
})

videosRouter.get('/:id?', async (req: Request, res: Response) => {
  const id = req.params.id
  const video = await VideoService.getVideoById(Number(id))

  if (!id) {
    return res.sendStatus(CodeResponseEnum.NOT_FOUND_404)
  }

  if (!video) {
    return res.sendStatus(CodeResponseEnum.NOT_FOUND_404)
  }

  res.status(CodeResponseEnum.OK_200).send(video)
})

videosRouter.post('/', async (req: Request, res: Response) => {
  const title = req.body.title
  const author = req.body.author
  const minAgeRestriction = req.body.minAgeRestriction
  const canBeDownloaded = req.body.canBeDownloaded
  const availableResolutions = req.body.availableResolutions as VideoAvailableResolutions[]

  const errors = inputValidation(title, author, availableResolutions)

  if (errors?.length) {
    return res.status(CodeResponseEnum.BAD_REQUEST_400).send(
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
    return res.sendStatus(CodeResponseEnum.BAD_REQUEST_400)
  }

  res.status(CodeResponseEnum.CREATED_201).send(video)
})

videosRouter.put('/:id?', async (req: Request, res: Response) => {
  const id = req.params.id

  if (!id) {
    return res.sendStatus(CodeResponseEnum.NOT_FOUND_404)
  }

  const title = req.body.title || ''
  const author = req.body.author || ''
  const availableResolutions = req.body.availableResolutions || null
  const errors = inputValidation(title, author, availableResolutions)

  const existedVideo = await VideoService.getVideoById(Number(req.params.id))

  if (!existedVideo) {
    return res.sendStatus(CodeResponseEnum.NOT_FOUND_404)
  }

  if (errors?.length) {
    return res.status(CodeResponseEnum.BAD_REQUEST_400).send(
      {
        errorsMessages: errors
      }
    )
  }

  const video = await VideoService.updateVideo(Number(req.params.id), req.body)

  if (!video) {
    return res.sendStatus(CodeResponseEnum.NOT_FOUND_404)
  }

  res.status(CodeResponseEnum.NO_CONTENT_204).send(video)
})

videosRouter.delete('/:id?', async (req: Request, res: Response) => {
  const id = req.params.id

  if (!id) {
    return res.sendStatus(CodeResponseEnum.NOT_FOUND_404)
  }

  const response = await VideoService.deleteVideo(Number(req.params.id))

  if (!response) {
    return res.sendStatus(CodeResponseEnum.NOT_FOUND_404)
  }

  res.sendStatus(CodeResponseEnum.NOT_FOUND_404)
})