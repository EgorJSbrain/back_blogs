import { Collection, MongoClient, Document } from 'mongodb'
import dotenv from 'dotenv'
import { DBfields } from './constants'

dotenv.config()

if (!process.env.MONGO_URL) {
  throw new Error('DB does not exist!')
}

const isTestDb = process.env.NODE_ENV === 'test'

const dbUrl =
  (isTestDb
    ? process.env.TEST_MONGO_URL
    : process.env.MONGO_URL) ??
  'mongodb+srv://user:user1@cluster0.w3gbicr.mongodb.net/studying-test'

const dbName = isTestDb ? process.env.TEST_MONGO_DB_NAME : process.env.MONGO_DB_NAME
export const client = new MongoClient(dbUrl)

export const getCollection = <T extends Document>(
  collection: DBfields
): Collection<T> => client.db().collection<T>(collection)

export const dbConnection = async (): Promise<undefined> => {
  try {
    await client.connect()

    console.log('db connected', dbUrl)
  } catch {
    await client.close()
  }
}

export const dbDisconnect = async (): Promise<undefined> => {
  await client.close()
}

export const dbClear = async (): Promise<undefined> => {
  try {
    const collections = await client.db().listCollections().toArray()

    await Promise.all(collections.map(async (collection) => {
      return await client.db(dbName).dropCollection(collection.name)
    }))
  } catch {
    await client.close()
  }
}
