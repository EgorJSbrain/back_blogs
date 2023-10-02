import { Request } from 'express'
import { SortDirections } from '../constants/global'

export type RequestWithBody<T> = Request<{}, {}, T>
export type RequestWithQuery<T> = Request<T, {}, {}, {}>
export type RequestWithParams<T> = Request<{}, {}, {}, T>
export type RequestWithParamsAndBody<T, B> = Request<T, {}, B>

export type Error = {
  message: string
  field: string
}

export type RequestParams = {
  sortBy?: string
  sortDirection?: SortDirections
  pageNumber?: number
  pageSize?: number
}

export type ResponseBody<T> = {
  pagesCount: number
  page: number
  pageSize: number
  totalCount: number
  items: T[]
}
