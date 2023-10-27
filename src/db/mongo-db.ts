import mongoose from 'mongoose'
import { Collection, MongoClient, Document } from 'mongodb'
import dotenv from 'dotenv'
import { DBfields } from './constants'
import { APP_CONFIG } from '../app-config'

dotenv.config()

if (!APP_CONFIG.MONGO_URL) {
  throw new Error('DB does not exist!')
}

const isTestDb = process.env.NODE_ENV === 'test'

const dbUrl =
  (isTestDb ? APP_CONFIG.TEST_MONGO_URL : APP_CONFIG.MONGO_URL) ??
  'mongodb+srv://user:user1@cluster0.w3gbicr.mongodb.net/studying-test'

// const dbName = isTestDb
//   ? APP_CONFIG.TEST_MONGO_DB_NAME
//   : APP_CONFIG.MONGO_DB_NAME
export const client = new MongoClient(dbUrl)

export const getCollection = <T extends Document>(
  collection: DBfields
): Collection<T> => client.db().collection<T>(collection)

export const dbConnection = async (): Promise<undefined> => {
  try {
    await mongoose.connect(dbUrl)
    await client.connect()

    console.log('db connected', dbUrl)
  } catch {
    await mongoose.disconnect()
    await client.close()
  }
}

export const dbDisconnect = async (): Promise<undefined> => {
  await client.close()
  await mongoose.disconnect()
}

export const dbClear = async (): Promise<undefined> => {
  try {
    // const collections = await client.db().listCollections().toArray()

    // await Promise.all(
    //   collections.map(async (collection) => {
    //     return await client.db(dbName).dropCollection(collection.name)
    //   })
    // )
    const collectionsMongoose = mongoose.connection.collections
    for (const key in collectionsMongoose) {
      const collection = collectionsMongoose[key]
      await collection.deleteMany({})
    }
  } catch {
    await mongoose.disconnect()
    await client.close()
  }
}
