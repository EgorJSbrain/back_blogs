import { v4 } from 'uuid'
import add from 'date-fns/add'

import { IVideo } from '../types/videos'
import { CreateVideoDto } from '../dtos/videos/create-video.dto'
import { CreateRequestDto } from '../dtos/requests/create-request.dto'
import { IRequest } from '../types/requests'
import { IRefreshTokenMeta } from '../types/tokens'
import { CreateRefreshTokenDto } from '../dtos/tokens/create-refresh-token.dto'

export const generateNewVideo = (data: CreateVideoDto): IVideo => {
  const createdDate = Number(new Date()) - 1000 * 60 * 60 * 24

  return {
    id: Number(new Date()).toString(),
    title: data.title,
    author: data.author,
    availableResolutions: data.availableResolutions,
    minAgeRestriction: data.minAgeRestriction || null,
    canBeDownloaded: data.canBeDownloaded || false,
    createdAt: new Date(createdDate).toISOString(),
    publicationDate: new Date().toISOString()
  }
}

export const generateNewReuest = (data: CreateRequestDto): IRequest => ({
  id: Number(new Date()).toString(),
  ip: data.ip,
  url: data.url,
  date: new Date().toISOString()
})

export const generateNewRefreshToken = (
  data: CreateRefreshTokenDto
): IRefreshTokenMeta => {
  const timeStamp = new Date()

  return {
    ip: data.ip,
    userId: data.userId,
    deviceId: v4(),
    title: data.title,
    lastActiveDate: timeStamp.toISOString(),
    expiredDate: add(timeStamp, {
      seconds: 20
    }).toISOString()
  }
}
