import add from 'date-fns/add'
import { JwtService } from '../applications/jwt-service'
import { CreateRefreshTokenDto } from '../dtos/tokens/create-refresh-token.dto'
import { TokensRepository } from '../repositories'
import { generateNewRefreshToken } from './utils'

export const TokensService = {
  async getAllTokens(userId: string) {
    return await TokensRepository.getAllTokenByUserId(userId)
  },

  async getToken(token: string) {
    const { lastActiveDate } = JwtService.decodeRefreshToken(token)

    return await TokensRepository.getTokenByDate(lastActiveDate)
  },

  async getTokenByDeviceId(deviceId: string) {
    return await TokensRepository.getTokenByDeviceId(deviceId)
  },

  async createRefreshToken(data: CreateRefreshTokenDto) {
    const newRefreshToken = generateNewRefreshToken(data)

    await TokensRepository.createRefreshToken(newRefreshToken)

    return newRefreshToken
  },

  async updateRefreshToken(date: string) {
    const newDate = new Date()
    const newExpiredDate = add(newDate, {
      seconds: 20
    }).toISOString()
    const newRefreshToken = await TokensRepository.updateRefreshToken(
      date,
      newDate.toISOString(),
      newExpiredDate
    )

    return newRefreshToken
  },

  async deleteRefreshTokens(token: string) {
    const { lastActiveDate, userId } = JwtService.decodeRefreshToken(token)

    const newRefreshToken = await TokensRepository.deleteRefreshTokens(userId, lastActiveDate)

    return newRefreshToken
  },

  async deleteRefreshToken(userId: string, deviceId: string) {
    const newRefreshToken = await TokensRepository.deleteRefreshToken(userId, deviceId)

    return newRefreshToken
  }
}
