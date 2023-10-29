import { Schema, model } from 'mongoose'
import { IUser, IUserAccountData, IUserEmailConfirmation, IUserSecurity } from '../types/users'

const UserSecuritySchema = new Schema<IUserSecurity>({
  recoveryPasswordCode: { type: String }
})

const ProfileSchema = new Schema<IUserAccountData>({
  id: { type: String, required: true },
  login: { type: String, required: true },
  email: { type: String, required: true },
  createdAt: { type: String, required: true }
})

const ConfiramationSchema = new Schema<IUserEmailConfirmation>({
  confirmationCode: { type: String, required: true },
  expirationDate: { type: Date, required: true },
  isConfirmed: { type: Boolean, required: true }
})

const UserSchema = new Schema<IUser>({
  accountData: { type: ProfileSchema },
  emailConfirmation: { type: ConfiramationSchema },
  passwordSalt: { type: String, required: true },
  passwordHash: { type: String, required: true },
  userSecurity: { type: UserSecuritySchema }
})

export const User = model('users', UserSchema)
