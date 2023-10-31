import { generateApp } from './app'
import { dbConnection } from './db/mongo-db'
import { APP_CONFIG } from './app-config'

const PORT = APP_CONFIG.PORT

const startApp = async (): Promise<undefined> => {
  await dbConnection()

  generateApp().listen(PORT, () => {
    console.log(`SERVER START PORT-${PORT}`)
  })
}

void startApp()
