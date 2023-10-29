import { RequestParams } from './global'

export interface IUser {
  accountData: IUserAccountData
  emailConfirmation: IUserEmailConfirmation
  userSecurity: IUserSecurity
  passwordSalt?: string
  passwordHash?: string
  recoveryPasswordCode?: string
}

export interface ICreatingUser {
  accountData: IUserAccountData
  emailConfirmation: IUserEmailConfirmation
  passwordSalt?: string
  passwordHash?: string
}

export interface IUserAccountData {
  id: string
  login: string
  email: string
  createdAt: string
}

export interface IUserSecurity {
  recoveryPasswordCode?: string
}

export interface IUserEmailConfirmation {
  confirmationCode: string
  expirationDate: Date
  isConfirmed: boolean
}

export type UsersRequestParams = RequestParams & {
  searchLoginTerm?: string
  searchEmailTerm?: string
}
