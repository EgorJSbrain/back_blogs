import { body, query } from 'express-validator'
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
  BLOG_ID_MIN_LENGTH,
  CONTENT_MAX_LENGTH,
  CONTENT_MIN_LENGTH,
  PostInputFields,
  SHORT_DESCRIPTION_MAX_LENGTH,
  SHORT_DESCRIPTION_MIN_LENGTH,
  TITLE_MAX_LENGTH,
  TITLE_MIN_LENGTH,
  postsErrorMessage
} from '../../constants/posts'
import {
  TITLE_MAX_LENGTH as VIDEO_TITLE_MAX_LENGTH,
  TITLE_MIN_LENGTH as VIDEO_TITLE_MIN_LENGTH,
  AUTHOR_MAX_LENGTH,
  AUTHOR_MIN_LENGTH,
  AGE_RESTRICTION_MAX,
  AGE_RESTRICTION_MIN,
  videoErrorMessage,
  VideoInputFields,
  videoAvailableResolutions,
  VideoAvailableResolutions
} from '../../constants/videos'
import { BlogsService } from '../../services'
import {
  DEFAULT_PAGE_NUMBER,
  DEFAULT_PAGE_SIZE,
  RequestParamName,
  SortDirections,
  requestParamErrorMessage
} from '../../constants/global'
import {
  LOGIN_MAX_LENGTH,
  LOGIN_MIN_LENGTH,
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  UserInputFields,
  usersErrorMessage
} from '../../constants/users'

// params

export const pageNumberValidation = query([RequestParamName.pageNumber])
  .customSanitizer(async (value: string) => {
    if (value && Number(value) < DEFAULT_PAGE_NUMBER) {
      return null
    }

    return value
  })
  .exists({ checkNull: true })
  .withMessage(requestParamErrorMessage.page)

export const pageSizeNumberValidation = query([RequestParamName.pageSize])
  .customSanitizer(async (value: string) => {
    if (value && Number(value) < DEFAULT_PAGE_SIZE) {
      return null
    }

    return value
  })
  .exists({ checkNull: true })
  .withMessage(requestParamErrorMessage.pageSize)

export const sortDirectionValidation = query([RequestParamName.sortDirection])
  .customSanitizer(async (value: string) => {
    if (value && value !== SortDirections.asc && value !== SortDirections.desc) {
      return null
    }

    return value
  })
  .exists({ checkNull: true })
  .withMessage(requestParamErrorMessage.sortDirection)

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

export const postBlogIdValidation = body([PostInputFields.blogId])
  .trim()
  .isLength({ min: BLOG_ID_MIN_LENGTH })
  .customSanitizer(async (value) => {
    const existedBlog = await BlogsService.getBlogById(value)

    if (!existedBlog) {
      return null
    }

    return value
  })
  .exists({ checkNull: true })
  .withMessage(postsErrorMessage.blogIdRequired)

// videos

export const videoTitleValidation = body([VideoInputFields.title])
  .trim()
  .isLength({ min: VIDEO_TITLE_MIN_LENGTH, max: VIDEO_TITLE_MAX_LENGTH })
  .withMessage(videoErrorMessage.titleLength)

export const videoAuthorValidation = body([
  VideoInputFields.author
])
  .trim()
  .isLength({
    min: AUTHOR_MIN_LENGTH,
    max: AUTHOR_MAX_LENGTH
  })
  .withMessage(videoErrorMessage.authorLength)

export const videoAgeRestrictionValidation = body([VideoInputFields.minAgeRestriction])
  .isFloat({ min: AGE_RESTRICTION_MIN, max: AGE_RESTRICTION_MAX })
  .withMessage(videoErrorMessage.ageRestriction)

export const videoAvailableResolutionsValidation = body([VideoInputFields.availableResolutions])
  .customSanitizer(async (value: VideoAvailableResolutions[]) => {
    const includeUnavailableResolution = value?.every((availableResolution) =>
      videoAvailableResolutions.includes(availableResolution)
    )

    if (!includeUnavailableResolution) {
      return null
    }

    return value
  })
  .exists({ checkNull: true })
  .withMessage(videoErrorMessage.availableResolutions)

export const videoCanBeDownloadedValidation = body([VideoInputFields.canBeDownloaded])
  .customSanitizer(async (value) => {
    if (value && typeof value !== 'boolean') {
      return null
    }

    return value
  })
  .exists({ checkNull: true })
  .withMessage(videoErrorMessage.canBeDownloaded)

export const videoPublicationDateValidation = body([
  VideoInputFields.publicationDate
])
  .customSanitizer(async (value) => {
    if (value && typeof value !== 'string') {
      return null
    }

    return value
  })
  .exists({ checkNull: true })
  .withMessage(videoErrorMessage.publicationDate)

// users

export const userLoginValidation = body([UserInputFields.login])
  .trim()
  .isLength({ min: LOGIN_MIN_LENGTH, max: LOGIN_MAX_LENGTH })
  .withMessage(usersErrorMessage.loginLength)

export const userPasswordValidation = body([UserInputFields.password])
  .trim()
  .isLength({ min: PASSWORD_MIN_LENGTH, max: PASSWORD_MAX_LENGTH })
  .withMessage(usersErrorMessage.passwordLength)

export const userLoginFormatValidation = body([UserInputFields.login])
  .trim()
  .matches(/^[a-zA-Z0-9_-]*$/)
  .withMessage(usersErrorMessage.loginFormat)

export const userEmailValidation = body([UserInputFields.email])
  .trim()
  .matches(/^[\w-\\.]+@([\w-]+\.)+[\w-]{2,4}$/)
  .withMessage(usersErrorMessage.emailFormat)

export const userLoginOrEmailValidation = body([UserInputFields.loginOrEmail])
  .trim()
  .isLength({ min: LOGIN_MIN_LENGTH, max: LOGIN_MAX_LENGTH })
  .withMessage(usersErrorMessage.loginOrEmailRequired)
