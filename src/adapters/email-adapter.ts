import nodemailer from 'nodemailer'
import { APP_CONFIG } from '../app-config'

export const MailAdapter = {
  transporter: nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: APP_CONFIG.SMTP_USER,
      pass: APP_CONFIG.SMTP_PASSWORD
    }
  }),

  async sendActivationMail(to: string, subject: string, mailBody: string) {
    await this.transporter.sendMail({
      from: APP_CONFIG.SMTP_USER ?? '  ',
      to,
      subject,
      html: mailBody
    })
  }
}
