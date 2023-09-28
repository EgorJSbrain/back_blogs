import { Collection, MongoClient, Document } from 'mongodb'
import dotenv from 'dotenv'
import { DBfields } from './constants'

dotenv.config()

if (!process.env.MONGO_URL) {
  throw new Error('DB does not exist!')
}

export const client = new MongoClient(process.env.MONGO_URL)

export const getCollection = <T extends Document>(
  collection: DBfields
): Collection<T> => client.db().collection<T>(collection)

export const dbConnection = async (): Promise<undefined> => {
  try {
    await client.connect()

    console.log('db connected', process.env.MONGO_URL)
  } catch {
    await client.close()
  }
}
