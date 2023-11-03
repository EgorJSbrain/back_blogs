import jwt, { JwtPayload } from 'jsonwebtoken'
import { APP_CONFIG } from '../app-config'
import { usersService } from '../compositions/users'

export class JwtService {
  createAccessJWT(userId: string): string {
    const token = jwt.sign({ userId }, APP_CONFIG.ACCESS_JWT_SECRET, {
      expiresIn: '10m'
    })

    return token
  }

  createRefreshJWT(userId: string, lastActiveDate: string, deviceId: string): string {
    const token = jwt.sign(
      { userId, lastActiveDate, deviceId },
      APP_CONFIG.REFRESH_JWT_SECRET,
      { expiresIn: '20m' }
    )

    return token
  }

  getUserIdByToken(token: string): string | null {
    try {
      const result = jwt.decode(token) as JwtPayload

      return typeof result !== 'string' ? result.userId : null
    } catch {
      return null
    }
  }

  decodeRefreshToken(token: string): { userId: string, deviceId: string, lastActiveDate: string } {
    const { userId, deviceId, lastActiveDate } = jwt.decode(token) as jwt.JwtPayload

    return { userId, deviceId, lastActiveDate }
  }

  async verifyExperationToken(token: string): Promise<string | null> {
    const { userId, exp } = jwt.decode(token) as jwt.JwtPayload

    if (!exp) return null

    const user = await usersService.getUserById(userId)

    if (!user) return null

    const expTime = exp * 1000

    if (expTime < Number(new Date())) {
      return null
    }

    return user.accountData.id
  }

  async refreshTokens(
    userId: string,
    deviceId: string,
    lastActiveDate: string
  ): Promise<{ accessToken: string, refreshToken: string } | null> {
    try {
      const accessToken = this.createAccessJWT(userId)
      const refreshToken = this.createRefreshJWT(userId, lastActiveDate, deviceId)

      return { accessToken, refreshToken }
    } catch {
      return null
    }
  }
}

export const jwtService = new JwtService()
