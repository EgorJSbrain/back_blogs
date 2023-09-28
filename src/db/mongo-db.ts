import { MongoClient } from 'mongodb'
import dotenv from 'dotenv'

dotenv.config()

export const client = new MongoClient(
  process.env.MONGO_URL ??
    `mongodb+srv://user:${process.env.DB_PASSWORD}@cluster0.gshiwjb.mongodb.net/studying-dev`
)

export const dbConnection = async (): Promise<undefined> => {
  try {
    await client.connect()

    console.log('db connected', process.env.MONGO_URL)
  } catch {
    await client.close()
  }
}
