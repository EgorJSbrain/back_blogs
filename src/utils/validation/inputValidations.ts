import {
  blogDescriptionValidation,
  blogNameValidation,
  websiteUrlLengthValidation,
  websiteUrlValidation,
} from "./validationRules";

export const BlogsCreateUpdateValidation = () => ([
  blogNameValidation,
  blogDescriptionValidation,
  websiteUrlLengthValidation,
  websiteUrlValidation,
])
