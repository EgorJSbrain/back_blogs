import { body } from 'express-validator'
import {
  BlogInputFields,
  NAME_MIN_LENGTH,
  NAME_MAX_LENGTH,
  DESCRIPTION_MAX_LENGTH,
  DESCRIPTION_MIN_LENGTH,
  URL_MAX_LENGTH,
  URL_MIN_LENGTH,
  blogsErrorMessage
} from '../../constants/blogs'
import {
  CONTENT_MAX_LENGTH,
  CONTENT_MIN_LENGTH,
  PostInputFields,
  SHORT_DESCRIPTION_MAX_LENGTH,
  SHORT_DESCRIPTION_MIN_LENGTH,
  TITLE_MAX_LENGTH,
  TITLE_MIN_LENGTH,
  postsErrorMessage
} from '../../constants/posts'

// blogs

export const blogNameValidation = body([BlogInputFields.name])
  .trim()
  .isLength({ min: NAME_MIN_LENGTH, max: NAME_MAX_LENGTH })
  .withMessage(blogsErrorMessage.nameLength)

export const blogDescriptionValidation = body([BlogInputFields.description])
  .trim()
  .isLength({ min: DESCRIPTION_MIN_LENGTH, max: DESCRIPTION_MAX_LENGTH })
  .withMessage(blogsErrorMessage.descriptionLength)

export const websiteUrlLengthValidation = body([BlogInputFields.websiteUrl])
  .trim()
  .isLength({ min: URL_MIN_LENGTH, max: URL_MAX_LENGTH })
  .withMessage(blogsErrorMessage.websiteUrlLength)

export const websiteUrlValidation = body([BlogInputFields.websiteUrl])
  .trim()
  .isLength({ min: DESCRIPTION_MIN_LENGTH, max: URL_MAX_LENGTH })
  .isURL()
  .withMessage(blogsErrorMessage.websiteUrl)

// posts

export const postTitleValidation = body([PostInputFields.title])
  .trim()
  .isLength({ min: TITLE_MIN_LENGTH, max: TITLE_MAX_LENGTH })
  .withMessage(postsErrorMessage.titleLength)

export const postDescriptionValidation = body([PostInputFields.shortDescription])
  .trim()
  .isLength({ min: SHORT_DESCRIPTION_MIN_LENGTH, max: SHORT_DESCRIPTION_MAX_LENGTH })
  .withMessage(postsErrorMessage.descriptionLength)

export const postContentValidation = body([PostInputFields.content])
  .trim()
  .isLength({ min: CONTENT_MIN_LENGTH, max: CONTENT_MAX_LENGTH })
  .withMessage(postsErrorMessage.contentLength)
