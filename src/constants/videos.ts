export const TITLE_MAX_LENGTH = 40
export const TITLE_MIN_LENGTH = 3
export const AUTHOR_MAX_LENGTH = 20
export const AUTHOR_MIN_LENGTH = 3
export const AGE_RESTRICTION_MAX = 18
export const AGE_RESTRICTION_MIN = 1

export enum VideoAvailableResolutions {
  P144 = 'P144',
  P240 = 'P240',
  P360 = 'P360',
  P480 = 'P480',
  P720 = 'P720',
  P1080 = 'P1080',
  P1440 = 'P1440',
  P2160 = 'P2160'
}

export enum VideoInputFields {
  title = 'title',
  author = 'author',
  availableResolutions = 'availableResolutions',
  minAgeRestriction = 'minAgeRestriction',
  canBeDownloaded = 'canBeDownloaded',
  publicationDate = 'publicationDate'
}

export const videoAvailableResolutions = [
  VideoAvailableResolutions.P144,
  VideoAvailableResolutions.P240,
  VideoAvailableResolutions.P360,
  VideoAvailableResolutions.P480,
  VideoAvailableResolutions.P720,
  VideoAvailableResolutions.P1080,
  VideoAvailableResolutions.P1440,
  VideoAvailableResolutions.P2160
]

export const videoErrorMessage = {
  title: 'Title is required field',
  titleLength: `Length of title shouldn't be less than ${TITLE_MIN_LENGTH} more than ${TITLE_MAX_LENGTH} symbols`,
  author: 'Author is required field',
  authorLength: `Length of author shouldn't be more than ${AUTHOR_MAX_LENGTH} symbols`,
  availableResolutions: 'Available resolution include not supported format',
  availableResolutionsRequired: 'Available resolution is required field',
  ageRestriction: `Age should be more than ${AGE_RESTRICTION_MIN} and not more than ${AGE_RESTRICTION_MAX}`,
  canBeDownloaded: 'canBeDownloaded should be boolean type',
  publicationDate: 'publicationDate should be string type'
}
