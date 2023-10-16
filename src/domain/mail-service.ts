import { emailManager } from '../managers/email-manager'
import { UsersService } from '../services'

export const mailService = {
  async sendRegistrationConfirmationMail(login: string, email: string) {
    const existedUser = await UsersService.getUserByLoginOrEmail(login, email)

    if (!existedUser) {
      return null
    }

    const response = await emailManager.sendMailRegistrationConfirmation(existedUser)

    if (!response) return false

    return true
  }
}
