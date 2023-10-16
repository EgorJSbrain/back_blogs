import { emailManager } from '../managers/email-manager'
import { UsersService } from '../services'

export const mailService = {
  async sendRegistrationConfirmationMail(email: string) {
    const existedUser = await UsersService.getUserByEmail(email)

    if (!existedUser) {
      return null
    }

    const response = await emailManager.sendMailRegistrationConfirmation(existedUser)

    if (!response) return false

    return true
  }
}
