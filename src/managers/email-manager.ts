import { MailAdapter } from '../adapters/email-adapter'

export const emailManager = {
  async sendMailRegistrationConfirmation(user: any) {
    try {
      const message = `
        <h1>Thank for your registration</h1>
        <p>To finish registration please follow the link below:
         <a href='https://somesite.com/confirm-email?code=${'1234'}'>complete registration</a>
        </p>
      `
      await MailAdapter.sendActivationMail(
        user.email,
        'Confirm registration',
        message
      )

      return true
    } catch {
      return null
    }
  }
}
