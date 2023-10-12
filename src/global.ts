import dotenv from 'dotenv'

dotenv.config()

export const GLOBALS = {
  PORT: process.env.PORT || 3001,
  MONGO_URL: process.env.MONGO_URL,
  MONGO_DB_NAME: process.env.MONGO_DB_NAME,
  TEST_MONGO_URL: process.env.TEST_MONGO_URL,
  TEST_MONGO_DB_NAME: process.env.TEST_MONGO_DB_NAME,
  JWT_SECRET: 'user_jwt_secret'
}
