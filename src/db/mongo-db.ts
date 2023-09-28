import { MongoClient } from 'mongodb'
import dotenv from 'dotenv'

dotenv.config()

if (!process.env.MONGO_URL) {
  throw new Error('DB does not exist!')
}

export const client = new MongoClient(process.env.MONGO_URL)

export const dbConnection = async (): Promise<undefined> => {
  try {
    await client.connect()

    console.log('db connected', process.env.MONGO_URL)
  } catch {
    await client.close()
  }
}
