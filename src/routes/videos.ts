import { Router, Request, Response } from "express";
import { VideoService } from "../services/videos";
import { CodeResponseEnum } from "../constants/global";

export const videosRouter = Router({})

videosRouter.get('/', async (req: Request, res: Response) => {
  const videos = await VideoService.getVideos()

  if (!videos) {
    res.sendStatus(CodeResponseEnum.BAD_REQUEST_400)

    return
  }

  res.status(CodeResponseEnum.OK_200).send(videos)
})

videosRouter.get('/:id', async (req: Request, res: Response) => {
  const video = await VideoService.getVideoById(Number(req.params.id))

  if (!video) {
    res.sendStatus(CodeResponseEnum.BAD_REQUEST_400)

    return
  }

  res.status(CodeResponseEnum.OK_200).send(video)
})

videosRouter.post('/', async (req: Request, res: Response) => {
  const title = req.body.title

  if (!title) {
    res.sendStatus(CodeResponseEnum.BAD_REQUEST_400)

    return
  }

  const video = await VideoService.createVideo({ title })

  if (!video) {
    return res.sendStatus(CodeResponseEnum.BAD_REQUEST_400)
  }

  res.status(CodeResponseEnum.OK_200).send(video)
})

videosRouter.put('/:id', async (req: Request, res: Response) => {
  const video = await VideoService.updateVideo(req.params.id, req.body)

  if (!video) {
    return res.sendStatus(CodeResponseEnum.BAD_REQUEST_400)
  }

  res.status(CodeResponseEnum.OK_200).send(video)
})

videosRouter.delete('/:id', async (req: Request, res: Response) => {
  const video = await VideoService.deleteVideo(req.params.id)

  if (!video) {
    return res.sendStatus(CodeResponseEnum.BAD_REQUEST_400)
  }

  res.status(CodeResponseEnum.OK_200).send(video)
})

videosRouter.delete('/', async (req: Request, res: Response) => {
  const response = await VideoService.deleteAll()

  if (!response) {
    return res.sendStatus(CodeResponseEnum.BAD_REQUEST_400)
  }

  res.status(CodeResponseEnum.OK_200)
})