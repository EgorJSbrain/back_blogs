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
import { requestLogMiddleware } from './middlewares/requestLogMiddleware'

export const app = express()

app.set('trust proxy', true)
app.use(bodyParser.json())
app.use(cookieParser())

app.use(requestLogMiddleware)

app.use(RouterPaths.testing, globalRouter)
app.use(RouterPaths.videos, videosRouter)
app.use(RouterPaths.blogs, blogsRouter)
app.use(RouterPaths.posts, postsRouter)
app.use(RouterPaths.users, usersRouter)
app.use(RouterPaths.auth, authRouter)
app.use(RouterPaths.comments, commentsRouter)
