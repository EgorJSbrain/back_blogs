export const DEFAULT_PAGE_NUMBER = 1
export const DEFAULT_PAGE_SIZE = 10

export enum HTTP_STATUSES {
  OK_200 = 200,
  CREATED_201 = 201,
  NO_CONTENT_204 = 204,

  BAD_REQUEST_400 = 400,
  NOT_AUTHORIZED_401 = 401,
  FORBIDEN_403 = 403,
  NOT_FOUND_404 = 404,
  MANY_REQUESTS_429 = 429
}

export const RouterPaths = {
  videos: '/videos',
  blogs: '/blogs',
  posts: '/posts',
  testing: '/testing',
  users: '/users',
  comments: '/comments',
  auth: '/auth',
  security: '/security'
}

export enum SortDirections {
  asc = 'asc',
  desc = 'desc'
}
