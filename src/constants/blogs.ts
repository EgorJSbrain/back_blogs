export const NAME_MIN_LENGTH = 3
export const NAME_MAX_LENGTH = 15
export const DESCRIPTION_MIN_LENGTH = 1
export const DESCRIPTION_MAX_LENGTH = 500
export const URL_MIN_LENGTH = 5
export const URL_MAX_LENGTH = 100

export enum BlogInputFields {
  name = 'name',
  description = 'description',
  websiteUrl = 'websiteUrl'
}

export const blogsErrorMessage = {
  nameLength: `Length of name shouldn't be less than ${NAME_MIN_LENGTH} and more than ${NAME_MAX_LENGTH} symbols`,
  descriptionLength: `Length of description shouldn't be less than ${DESCRIPTION_MIN_LENGTH} and more than ${DESCRIPTION_MAX_LENGTH} symbols`,
  websiteUrl: 'WebsiteUrl is not valid',
  websiteUrlLength: `Length of website URL shouldn't be less than ${URL_MIN_LENGTH} and more than ${URL_MAX_LENGTH} symbols`
}
