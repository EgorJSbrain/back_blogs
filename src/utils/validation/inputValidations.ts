import { ValidationChain, FieldValidationError } from 'express-validator'
import {
  blogDescriptionValidation,
  blogNameValidation,
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
