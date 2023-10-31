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
  commentsRouter,
  securityRouter
} from './routes'
import { RouterPaths } from './constants/global'
import { requestLogMiddleware, requestsCountMiddleware } from './middlewares'

export const genApp = (): any => {
  const app = express()
  app.set('trust proxy', true)
  app.use(bodyParser.json())
  app.use(cookieParser())

  app.use(RouterPaths.testing, requestLogMiddleware, globalRouter)
  app.use(RouterPaths.videos, requestLogMiddleware, videosRouter)
  app.use(RouterPaths.blogs, requestLogMiddleware, blogsRouter)
  app.use(RouterPaths.posts, requestLogMiddleware, postsRouter)
  app.use(RouterPaths.users, requestLogMiddleware, usersRouter)
  app.use(
    RouterPaths.auth,
    requestsCountMiddleware,
    requestLogMiddleware,
    authRouter
  )
  app.use(RouterPaths.comments, requestLogMiddleware, commentsRouter)
  app.use(RouterPaths.security, requestLogMiddleware, securityRouter)

  return app
}
