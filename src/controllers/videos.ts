import { Response, Request } from 'express'
import { VideosService } from '../services'
import { RequestWithBody, RequestWithParams, RequestWithParamsAndBody } from '../types/global'

import { HTTP_STATUSES } from '../constants/global'
import { IVideo } from '../types/videos'
import { CreateVideoDto } from '../dtos/videos/create-video.dto'
import { UpdateVideoDto } from '../dtos/videos/update-video.dto'
import { VideoInputFields } from '../constants/videos'

export class VideosController {
  constructor(protected videosService: VideosService) {}

  async getVideos(_: Request, res: Response<IVideo[]>): Promise<undefined> {
    const videos = await this.videosService.getVideos()

    if (!videos) {
      res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
      return
    }

    res.status(HTTP_STATUSES.OK_200).send(videos)
  }

  async getVideoById(req: RequestWithParams<{ id: string }>, res: Response<IVideo>): Promise<undefined> {
    const { id } = req.params

    if (!id) {
      res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
      return
    }

    const video = await this.videosService.getVideoById(id)

    if (!video) {
      res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
      return
    }

    res.status(HTTP_STATUSES.OK_200).send(video)
  }

  async createVideo(req: RequestWithBody<CreateVideoDto>, res: Response): Promise<undefined> {
    const video = await this.videosService.createVideo(req.body)

    if (!video) {
      res.sendStatus(HTTP_STATUSES.BAD_REQUEST_400)
      return
    }

    res.status(HTTP_STATUSES.CREATED_201).send(video)
  }

  async updateVideo(
    req: RequestWithParamsAndBody<{ id: string }, UpdateVideoDto>,
    res: Response
  ): Promise<undefined> {
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
      res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
      return
    }

    const existedVideo = await this.videosService.getVideoById(id)

    if (!existedVideo) {
      res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
      return
    }

    const updatedVideo = {
      [VideoInputFields.title]: req.body[VideoInputFields.title]
        ? title
        : existedVideo?.title,
      [VideoInputFields.author]: req.body[VideoInputFields.author]
        ? author
        : existedVideo?.author,
      [VideoInputFields.minAgeRestriction]: req.body[
        VideoInputFields.minAgeRestriction
      ]
        ? minAgeRestriction
        : existedVideo?.minAgeRestriction || null,
      [VideoInputFields.canBeDownloaded]: req.body[
        VideoInputFields.canBeDownloaded
      ]
        ? canBeDownloaded
        : existedVideo?.canBeDownloaded,
      [VideoInputFields.availableResolutions]: req.body[
        VideoInputFields.availableResolutions
      ]
        ? availableResolutions
        : existedVideo?.availableResolutions,
      [VideoInputFields.publicationDate]: req.body[VideoInputFields.publicationDate]
        ? publicationDate
        : existedVideo?.publicationDate
    }

    const video = await this.videosService.updateVideo(id, updatedVideo)

    if (!video) {
      res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
      return
    }

    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
  }

  async deleteVideo(req: RequestWithParams<{ id: string }>, res: Response): Promise<undefined> {
    const { id } = req.params

    if (!id) {
      res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
      return
    }

    const existedVideo = await this.videosService.getVideoById(id)

    if (!existedVideo) {
      res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
      return
    }

    const response = await this.videosService.deleteVideo(id)

    if (!response) {
      res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
      return
    }

    res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)
  }
}
