export const DEFAULT_PAGE_NUMBER = 1
export const DEFAULT_PAGE_SIZE = 10

export enum HTTP_STATUSES {
  OK_200 = 200,
  CREATED_201 = 201,
  NO_CONTENT_204 = 204,

  BAD_REQUEST_400 = 400,
  NOT_AUTHORIZED_401 = 401,
  NOT_FOUND_404 = 404
}

export const RouterPaths = {
  videos: '/videos',
  blogs: '/blogs',
  posts: '/posts',
  testing: '/testing'
}

export enum SortDirections {
  asc = 'asc',
  desc = 'desc'
}

export enum RequestParamName {
  pageNumber = 'pageNumber',
  pageSize = 'pageSize',
  sortDirection = 'sortDirection'
}

export const requestParamErrorMessage = {
  page: `${RequestParamName.pageNumber} should be correct number`,
  pageSize: `${RequestParamName.pageSize} should be correct number`,
  sortDirection: `sortDirection should be correct: ${SortDirections.asc} or ${SortDirections.desc}`
}
