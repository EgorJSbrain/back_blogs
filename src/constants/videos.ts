export const enum VideoAvailableResolutions {
  P144 = "P144",
  P240 = "P240",
  P360 = "P360",
  P480 = "P480",
  P720 = "P720",
  P1080 = "P1080",
  P1440 = "P1440",
  P2160 = "P2160"
}

export const enum VideoInputFields {
  title = "title",
  author = "author",
  availableResolutions = "availableResolutions",
  minAgeRestriction = "minAgeRestriction",
}

export const videoAvailableResolutions = [
  VideoAvailableResolutions.P144,
  VideoAvailableResolutions.P240,
  VideoAvailableResolutions.P360,
  VideoAvailableResolutions.P480,
  VideoAvailableResolutions.P720,
  VideoAvailableResolutions.P1080,
  VideoAvailableResolutions.P1440,
  VideoAvailableResolutions.P2160,
]

export const errorMessage = {
  title: "Title is required field",
  maxTitleLength: "Length of title shouldn't be more than 40 symbols",
  author: "Author is required field",
  availableResolutions: "Available resolution include not supported format",
  availableResolutionsRequired: "Available resolution is required field",
  ageRestriction: "Age should be more than 1 and not more than 18",
}
