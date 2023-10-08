import express from 'express'
import bodyParser from 'body-parser'
import {
  videosRouter,
  globalRouter,
  blogsRouter,
  postsRouter,
  usersRouter
} from './routes'
import { RouterPaths } from './constants/global'

export const app = express()

app.use(bodyParser.json())

app.use(RouterPaths.testing, globalRouter)
app.use(RouterPaths.videos, videosRouter)
app.use(RouterPaths.blogs, blogsRouter)
app.use(RouterPaths.posts, postsRouter)
app.use(RouterPaths.users, usersRouter)
