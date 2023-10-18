import express from 'express'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'

import {
  videosRouter,
  globalRouter,
  blogsRouter,
  postsRouter,
  usersRouter,
  authRouter,
  commentsRouter
} from './routes'
import { RouterPaths } from './constants/global'

export const app = express()

app.use(bodyParser.json())
app.use(cookieParser())

app.use(RouterPaths.testing, globalRouter)
app.use(RouterPaths.videos, videosRouter)
app.use(RouterPaths.blogs, blogsRouter)
app.use(RouterPaths.posts, postsRouter)
app.use(RouterPaths.users, usersRouter)
app.use(RouterPaths.auth, authRouter)
app.use(RouterPaths.comments, commentsRouter)
