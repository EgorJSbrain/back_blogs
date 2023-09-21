export enum BlogInputFields {
  name = "name",
  description = "description",
  websiteUrl = "websiteUrl",
}

export const errorMessage = {
  title: "Title is required field",
  maxTitleLength: "Length of title shouldn't be more than 40 symbols",
  author: "Author is required field",
  maxAuthorLength: "Length of author shouldn't be more than 20 symbols",
  availableResolutions: "Available resolution include not supported format",
  availableResolutionsRequired: "Available resolution is required field",
  ageRestriction: "Age should be more than 1 and not more than 18",
  canBeDownloaded: "canBeDownloaded should be boolean type",
  publicationDate: "publicationDate should be string type",
}
