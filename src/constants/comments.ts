export const COMMENT_CONTENT_MIN_LENGTH = 20
export const COMMENT_CONTENT_MAX_LENGTH = 300

export enum CommentInputFields {
  content = 'content',
  likeStatus = 'likeStatus',
}

export const commentsErrorMessage = {
  // eslint-disable-next-line max-len
  contentLength: `Length of content shouldn't be less than ${COMMENT_CONTENT_MIN_LENGTH} and more than ${COMMENT_CONTENT_MAX_LENGTH} symbols`,
  likeInfo: 'Like status should be correct'
}
