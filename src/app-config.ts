import dotenv from 'dotenv'

dotenv.config()

export const APP_CONFIG = {
  PORT: process.env.PORT || 3001,
  MONGO_URL: process.env.MONGO_URL,
  TEST_MONGO_URL: process.env.TEST_MONGO_URL,
  REFRESH_JWT_SECRET: 'refresh_jwt-secret',
  ACCESS_JWT_SECRET: 'access-jwt_secret',
  SMTP_USER: process.env.SMTP_USER,
  SMTP_PASSWORD: process.env.SMTP_PASSWORD
}
