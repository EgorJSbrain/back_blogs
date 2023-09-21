import { ValidationChain } from 'express-validator'
import {
  blogDescriptionValidation,
  blogNameValidation,
  websiteUrlLengthValidation,
  websiteUrlValidation
} from './validationRules'

export const BlogsCreateUpdateValidation = (): ValidationChain[] => [
  blogNameValidation,
  blogDescriptionValidation,
  websiteUrlLengthValidation,
  websiteUrlValidation
]
