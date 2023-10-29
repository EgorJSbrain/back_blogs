import { emailManager } from '../managers/email-manager'
import { UsersService } from '../services'

export const mailService = {
  async sendRegistrationConfirmationMail(email: string) {
    const existedUser = await UsersService.getUserByEmail(email)

    if (!existedUser) {
      return false
    }

    const response = await emailManager.sendMailRegistrationConfirmation(existedUser)

    if (!response) return false

    return true
  },

  async sendRecoveryPasswordMail(email: string) {
    const existedUser = await UsersService.getUserByEmail(email)

    if (!existedUser) {
      return false
    }

    const response = await emailManager.sendMailRecoveryPassword(existedUser)

    if (!response) return false

    return true
  }
}
