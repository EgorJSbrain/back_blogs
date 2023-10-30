import { app } from './app'
import { dbConnection } from './db/mongo-db'
import { APP_CONFIG } from './app-config'

const PORT = APP_CONFIG.PORT

app.listen(PORT, async () => {
  console.log(`---BEFORE----SERVER START PORT-${PORT}`)
  await dbConnection()
  console.log(`---AFTER----SERVER START PORT-${PORT}`)

  console.log(`SERVER START PORT-${PORT}`)
})
