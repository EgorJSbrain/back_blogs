import dotenv from 'dotenv'
import { app } from './app';

dotenv.config()

const PORT = process.env.PORT || 3001;
  
app.listen(PORT, async () => {
    console.log(`SERVER START PORT-${process.env.PORT}`)
  }
)
