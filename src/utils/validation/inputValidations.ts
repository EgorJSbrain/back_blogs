import { ValidationChain, FieldValidationError } from 'express-validator'
import {
  blogDescriptionValidation,
  blogNameValidation,
  postBlogIdValidation,
  postContentValidation,
  postDescriptionValidation,
  postTitleValidation,
  videoAgeRestrictionValidation,
  videoAuthorValidation,
  videoAvailableResolutionsValidation,
  videoCanBeDownloadedValidation,
  videoPublicationDateValidation,
  videoTitleValidation,
  websiteUrlLengthValidation,
  websiteUrlValidation
} from './validationRules'
import { Error } from '../../types/global'

export const transformErrors = (errors: FieldValidationError[]): Error[] => errors.map(error => ({
  field: error.path,
  message: error.msg
}))

export const BlogsCreateUpdateValidation = (): ValidationChain[] => [
  blogNameValidation,
  blogDescriptionValidation,
  websiteUrlLengthValidation,
  websiteUrlValidation
]

export const PostsCreateUpdateValidation = (): ValidationChain[] => [
  postTitleValidation,
  postDescriptionValidation,
  postContentValidation,
  postBlogIdValidation
]

export const VideoCreateValidation = (): ValidationChain[] => [
  videoTitleValidation,
  videoAuthorValidation,
  videoAvailableResolutionsValidation
]

export const VideoUpdateValidation = (): ValidationChain[] => [
  videoTitleValidation,
  videoAuthorValidation,
  videoAgeRestrictionValidation,
  videoAvailableResolutionsValidation,
  videoCanBeDownloadedValidation,
  videoPublicationDateValidation
]
