import express from 'express'
import bodyParser from 'body-parser'
import { videosRouter, globalRouter } from './routes'

export const app = express()
app.use(bodyParser.json())

app.use('/videos', videosRouter)
app.use('/all-data', globalRouter)
