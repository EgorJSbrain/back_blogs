import { app } from './app'
import { dbConnection } from './db/mongo-db'
import { GLOBALS } from './global'

const PORT = GLOBALS.PORT

app.listen(PORT, async () => {
  await dbConnection()

  console.log(`SERVER START PORT-${PORT}`)
})
