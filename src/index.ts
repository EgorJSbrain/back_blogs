import dotenv from 'dotenv'
import { app } from './app'
import { dbConnection } from './db/mongo-db'

dotenv.config()

const PORT = process.env.PORT || 3001

app.listen(PORT, async () => {
  await dbConnection()

  console.log(`SERVER START PORT-${process.env.PORT}`)
})
