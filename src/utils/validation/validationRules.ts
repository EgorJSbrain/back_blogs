import { body } from 'express-validator';
import {
  BlogInputFields,
  NAME_MIN_LENGTH,
  NAME_MAX_LENGTH,
  DESCRIPTION_MAX_LENGTH,
  DESCRIPTION_MIN_LENGTH,
  URL_MAX_LENGTH,
  URL_MIN_LENGTH,
  blogsErrorMessage,
} from '../../constants/blogs';

export const blogNameValidation = body([BlogInputFields.name])
  .trim()
  .isLength({ min: NAME_MIN_LENGTH, max: NAME_MAX_LENGTH })
  .withMessage(blogsErrorMessage.nameLength);

export const blogDescriptionValidation = body([BlogInputFields.description])
  .trim()
  .isLength({ min: DESCRIPTION_MIN_LENGTH, max: DESCRIPTION_MAX_LENGTH })
  .withMessage(blogsErrorMessage.descriptionLength);

export const websiteUrlLengthValidation = body([BlogInputFields.websiteUrl])
  .trim()
  .isLength({ min: URL_MIN_LENGTH, max: URL_MAX_LENGTH })
  .withMessage(blogsErrorMessage.websiteUrlLength);

export const websiteUrlValidation = body([BlogInputFields.websiteUrl])
  .trim()
  .isLength({ min: DESCRIPTION_MIN_LENGTH, max: URL_MAX_LENGTH })
  .isURL()
  .withMessage(blogsErrorMessage.websiteUrl);
  