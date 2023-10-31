import { emailManager } from '../managers/email-manager'
import { IUser } from '../types/users'

export const mailService = {
  async sendRegistrationConfirmationMail(user: IUser) {
    const response = await emailManager.sendMailRegistrationConfirmation(user)

    if (!response) return false

    return true
  },

  async sendRecoveryPasswordMail(user: IUser) {
    const response = await emailManager.sendMailRecoveryPassword(user)

    if (!response) return false

    return true
  }
}
