import {
  VideoAvailableResolutions,
  VideoInputFields,
  errorMessage,
  videoAvailableResolutions
} from "../constants/videos"

const TITLE_MAX_LENGTH = 40
const AUTHOR_MAX_LENGTH = 20
const MIN_AGE_RESTRICTION = 1
const MAX_AGE_RESTRICTION = 18

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

export const inputValidation = (
  title: string,
  author: string,
  availableResolutions: VideoAvailableResolutions[] | null,
  minAgeRestriction?: number,
  canBeDownloaded?: boolean
) => {
  const errors: Error[] = []

  const includeUnavailableResolution = availableResolutions && availableResolutions.every(availableResolution =>
    videoAvailableResolutions.includes(availableResolution)
  )

  if (!title) {
    errors.push(errorConstructor(VideoInputFields.title, errorMessage.title))
  } else if (title && title.length > TITLE_MAX_LENGTH) {
    errors.push(errorConstructor(VideoInputFields.title, errorMessage.maxTitleLength))
  }

  if (
    (minAgeRestriction || minAgeRestriction === 0) &&
    (minAgeRestriction < MIN_AGE_RESTRICTION || minAgeRestriction > MAX_AGE_RESTRICTION)
  ) {
    errors.push(errorConstructor(VideoInputFields.minAgeRestriction, errorMessage.ageRestriction))
  }

  if (!author) {
    errors.push(errorConstructor(VideoInputFields.author, errorMessage.author))
  } else if (author && author.length > AUTHOR_MAX_LENGTH) {
    errors.push(errorConstructor(VideoInputFields.author, errorMessage.maxTitleLength))
  }

  if (!availableResolutions) {
    errors.push(errorConstructor(VideoInputFields.availableResolutions, errorMessage.availableResolutionsRequired))
  }

  if (typeof canBeDownloaded === 'boolean') {
    errors.push(errorConstructor(VideoInputFields.canBeDownloaded, errorMessage.canBeDownloaded))
  }

  if (!includeUnavailableResolution && availableResolutions) {
    errors.push(errorConstructor(
      VideoInputFields.availableResolutions,
      errorMessage.availableResolutions
    ))
  }

  return errors
}