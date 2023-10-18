import jwt from 'jsonwebtoken'
import { APP_CONFIG } from '../app-config'

export const JwtService = {
  createAccessJWT(userId: string) {
    const token = jwt.sign({ userId }, APP_CONFIG.ACCESS_JWT_SECRET, { expiresIn: '10s' })

    return token
  },

  createRefreshJWT(userId: string) {
    const token = jwt.sign({ userId }, APP_CONFIG.REFRESH_JWT_SECRET, { expiresIn: '20s' })

    return token
  },

  getUserIdByToken(token: string): string | null {
    try {
      const result: string | jwt.JwtPayload = jwt.verify(token, APP_CONFIG.ACCESS_JWT_SECRET)

      return typeof result !== 'string' ? result.userId : null
    } catch {
      return null
    }
  }
}
