export const TITLE_MIN_LENGTH = 3
export const TITLE_MAX_LENGTH = 30
export const SHORT_DESCRIPTION_MIN_LENGTH = 5
export const SHORT_DESCRIPTION_MAX_LENGTH = 100
export const CONTENT_MIN_LENGTH = 1
export const CONTENT_MAX_LENGTH = 1000
export const BLOG_ID_MIN_LENGTH = 5

export enum PostInputFields {
  title = 'title',
  blogId = 'blogId',
  content = 'content',
  shortDescription = 'shortDescription',
  blogName = 'blogName',
}

export const postsErrorMessage = {
  titleLength: `Length of title shouldn't be less than ${TITLE_MIN_LENGTH} and more than ${TITLE_MAX_LENGTH} symbols`,
  // eslint-disable-next-line max-len
  descriptionLength: `Length of description shouldn't be less than ${SHORT_DESCRIPTION_MIN_LENGTH} and more than ${SHORT_DESCRIPTION_MAX_LENGTH} symbols`,
  // eslint-disable-next-line max-len
  contentLength: `Length of content shouldn't be less than ${CONTENT_MIN_LENGTH} and more than ${CONTENT_MAX_LENGTH} symbols`,
  blogIdRequired: 'BlogId is requiered'
}
