import { RequestParams } from './global'

export interface IUser {
  id: string
  login: string
  email: string
  createdAt: string
}

export interface ICreatingUser {
  id: string
  login: string
  email: string
  passwordSalt: string
  passwordHash: string
  createdAt: string
}

export type UsersRequestParams = RequestParams & {
  searchLoginTerm?: string
  searchEmailTerm?: string
}
