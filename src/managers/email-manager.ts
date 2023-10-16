import { MailAdapter } from '../adapters/email-adapter'
import { IUser } from '../types/users'

export const emailManager = {
  async sendMailRegistrationConfirmation(user: IUser) {
    try {
      const message = `
        <h1>Thank for your registration</h1>
        <p>To finish registration please follow the link below:
          <a href='https://somesite.com/confirm-email?code=${user.emailConfirmation.confirmationCode}'>
            complete registration
          </a>
        </p>
      `
      await MailAdapter.sendActivationMail(
        user.accountData.email,
        'Confirm registration',
        message
      )

      return true
    } catch {
      return null
    }
  }
}
