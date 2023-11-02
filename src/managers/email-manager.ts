import { mailAdapter } from '../adapters/email-adapter'
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
      await mailAdapter.sendActivationMail(
        user.accountData.email,
        'Confirm registration',
        message
      )

      return true
    } catch {
      return null
    }
  },

  async sendMailRecoveryPassword(user: IUser) {
    try {
      const message = `
        <h1>Password recovery</h1>
        <p>To finish password recovery please follow the link below:
          <a href='https://somesite.com/password-recovery?recoveryCode=${user.userSecurity.recoveryPasswordCode}'>recovery password</a>
        </p>
      `
      await mailAdapter.sendActivationMail(
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
