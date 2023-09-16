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

videosRouter.get('/:id', async (req: Request, res: Response) => {
  const video = await VideoService.getVideoById(Number(req.params.id))

  if (!video) {
    return res.sendStatus(CodeResponseEnum.NOT_FOUND_404)
  }

  res.status(CodeResponseEnum.OK_200).send(video)
})

videosRouter.post('/', async (req: Request, res: Response) => {
  const title = req.body.title
  const author = req.body.author
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
    availableResolutions
  })

  if (!video) {
    return res.sendStatus(CodeResponseEnum.BAD_REQUEST_400)
  }

  res.status(CodeResponseEnum.CREATED_201).send(video)
})

videosRouter.put('/:id', async (req: Request, res: Response) => {
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

  res.status(CodeResponseEnum.OK_200).send(video)
})

videosRouter.delete('/:id', async (req: Request, res: Response) => {
  const response = await VideoService.deleteVideo(Number(req.params.id))

  if (!response) {
    return res.sendStatus(CodeResponseEnum.NOT_FOUND_404)
  }

  res.sendStatus(CodeResponseEnum.NO_CONTENT_204)
})