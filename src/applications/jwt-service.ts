import jwt, { JwtPayload } from 'jsonwebtoken'
import { APP_CONFIG } from '../app-config'
import { UsersService } from '../services'

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
      const result = jwt.decode(token) as JwtPayload

      return typeof result !== 'string' ? result.userId : null
    } catch {
      return null
    }
  },

  async verifyExperationToken(token: string) {
    const { userId, exp } = jwt.decode(token) as jwt.JwtPayload

    if (!exp) return false

    const user = await UsersService.getUserById(userId)

    if (!user) return false

    const expTime = exp * 1000

    if (expTime < Number(new Date())) {
      return false
    }

    return true
  },

  refreshTokens(token: string): { accessToken: string, refreshToken: string } | null {
    try {
      if (!this.verifyExperationToken(token)) {
        return null
      }

      const userId = this.getUserIdByToken(token)

      if (!userId) return null

      const user = UsersService.getUserById(userId)

      if (!user) return null

      const accessToken = this.createAccessJWT(userId)
      const refreshToken = this.createRefreshJWT(userId)

      return { accessToken, refreshToken }
    } catch {
      return null
    }
  }
}
