import { CreateVideoDto } from "../dtos/create-video.dto"

export const generateNewVideo = (data: CreateVideoDto) => {
  const createdDate = Number(new Date()) - 1000 * 60 * 60 * 24

  return {
    id: Number(new Date()),
    title: data.title,
    author: data.author,
    availableResolutions: data.availableResolutions,
    // minAgeRestriction: data.minAgeRestriction || null,
    // canBeDownloaded: data.canBeDownloaded || false,
    createdAt: new Date(createdDate).toISOString(),
    publicationDate: new Date().toISOString(),
  }
}