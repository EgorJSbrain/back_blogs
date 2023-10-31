import { genApp } from './app'
import { dbConnection } from './db/mongo-db'
import { APP_CONFIG } from './app-config'

const PORT = APP_CONFIG.PORT

// genApp().listen(PORT, async () => {
//   console.log('-----INDEX-BEFORE DB CONNECTION---')
//   await dbConnection()

//   console.log(`SERVER START PORT-${PORT}`)
// })

const startApp = async () => {
  await dbConnection()

  genApp().listen(PORT, async () => {
    console.log(`SERVER START PORT-${PORT}`)
  })
}

startApp()
