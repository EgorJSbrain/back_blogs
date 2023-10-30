import { app } from './app'
import { dbConnection } from './db/mongo-db'
import { APP_CONFIG } from './app-config'

const PORT = APP_CONFIG.PORT

app.listen(PORT, async () => {
  await dbConnection()

  console.log(`SERVER START PORT-${PORT}`)
})
