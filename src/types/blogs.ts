import { RequestParams } from './global'

export interface IBlog {
  id: string
  name: string
  description: string
  websiteUrl: string
  createdAt: string
  isMembership: boolean
}

export type BlogsRequestParams = RequestParams & {
  searchNameTerm?: string
}

export type BlogPostsRequestParams = {
  blogId: string
}
