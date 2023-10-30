import mongoose from 'mongoose'
import dotenv from 'dotenv'
import { APP_CONFIG } from '../app-config'

dotenv.config()

if (!APP_CONFIG.MONGO_URL) {
  throw new Error('DB does not exist!')
}

const isTestDb = process.env.NODE_ENV === 'test'

const dbUrl =
  (isTestDb ? APP_CONFIG.TEST_MONGO_URL : APP_CONFIG.MONGO_URL) ??
  'mongodb+srv://user:user1@cluster0.w3gbicr.mongodb.net/studying-test'

export const dbConnection = async (): Promise<undefined> => {
  try {
    console.log('------dbUrl-----', dbUrl)
    await mongoose.connect(dbUrl)

    console.log('db connected', dbUrl)
  } catch (err) {
    console.log('-DB--err--1-', err)
    await mongoose.disconnect()
  }
}

export const dbDisconnect = async (): Promise<undefined> => {
  await mongoose.disconnect()
}

export const dbClear = async (): Promise<undefined> => {
  try {
    const collectionsMongoose = mongoose.connection.collections

    for (const key in collectionsMongoose) {
      const collection = collectionsMongoose[key]
      await collection.drop()
    }
  } catch {
    await mongoose.disconnect()
  }
}
