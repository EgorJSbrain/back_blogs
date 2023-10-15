import nodemailer from 'nodemailer'
import { GLOBALS } from '../global'

export const MailAdapter = {
  transporter: nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: GLOBALS.SMTP_USER,
      pass: GLOBALS.SMTP_PASSWORD
    }
  }),

  async sendActivationMail(to: string, subject: string, mailBody: string) {
    await this.transporter.sendMail({
      from: GLOBALS.SMTP_USER ?? '  ',
      to,
      subject,
      html: mailBody
    })
  }
}
