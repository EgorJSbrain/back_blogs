import jwt from 'jsonwebtoken'
import { IUser } from '../types/users'
import { GLOBALS } from '../global'

export const JwtService = {
  createJWT(user: IUser) {
    const token = jwt.sign({ userId: user.accountData.id }, GLOBALS.JWT_SECRET, { expiresIn: '1h' })

    return token
  },

  getUserIdByToken(token: string): string | null {
    try {
      const result: any = jwt.verify(token, GLOBALS.JWT_SECRET)

      return result.userId
    } catch {
      return null
    }
  }
}
