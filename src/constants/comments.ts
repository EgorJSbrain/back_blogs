export const CONTENT_MIN_LENGTH = 20
export const CONTENT_MAX_LENGTH = 300

export enum CommentInputFields {
  content = 'content',
}

export const commentsErrorMessage = {
  // eslint-disable-next-line max-len
  contentLength: `Length of content shouldn't be less than ${CONTENT_MIN_LENGTH} and more than ${CONTENT_MAX_LENGTH} symbols`
}
