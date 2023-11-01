import { RequestParams } from './global'

export class Blog {
  id: string
  createdAt: string
  isMembership: boolean

  constructor(
    public name: string,
    public description: string,
    public websiteUrl: string
  ) {
    this.id = Number(new Date()).toString()
    this.createdAt = new Date().toISOString()
    this.isMembership = false
  }
}

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
