import { RequestParams } from './global'
import { v4 } from 'uuid'
import add from 'date-fns/add'

export class User {
  accountData: IUserAccountData
  emailConfirmation: IUserEmailConfirmation

  constructor(
    login: string,
    email: string,
    public passwordHash: string,
    public passwordSalt: string,
    isConfirmed?: boolean
  ) {
    this.accountData = {
      id: Number(new Date()).toString(),
      login,
      email,
      createdAt: new Date().toISOString()
    }
    this.emailConfirmation = {
      confirmationCode: v4(),
      expirationDate: add(new Date(), {
        hours: 1,
        minutes: 10
      }),
      isConfirmed: !!isConfirmed
    }
  }
}

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
