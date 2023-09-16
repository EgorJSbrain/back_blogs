import express from 'express'
import bodyParser from 'body-parser'
import { videosRouter, globalRouter } from './routes'

export const app = express()
app.use(bodyParser.json())

app.use('/testing/all-data', globalRouter)
app.use('/videos', videosRouter)
