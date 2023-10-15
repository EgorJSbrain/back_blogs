import { RequestParams } from './global'

export interface IUser {
  accountData: IUserAccountData
  emailConfirmation: IUserEmailConfirmation
}

export interface ICreatingUser {
  accountData: IUserAccountData
  emailConfirmation: IUserEmailConfirmation
}

export interface IUserAccountData {
  id: string
  login: string
  email: string
  passwordSalt?: string
  passwordHash?: string
  createdAt: string
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
