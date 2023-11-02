import { emailManager } from '../managers/email-manager'
import { IUser } from '../types/users'

export class MailService {
  async sendRegistrationConfirmationMail(user: IUser): Promise<boolean> {
    const response = await emailManager.sendMailRegistrationConfirmation(user)

    if (!response) return false

    return true
  }

  async sendRecoveryPasswordMail(user: IUser): Promise<boolean> {
    const response = await emailManager.sendMailRecoveryPassword(user)

    if (!response) return false

    return true
  }
}

export const mailService = new MailService()
