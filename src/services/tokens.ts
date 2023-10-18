import { TokensRepository } from '../repositories'

export const TokensService = {
  async getToken(token: string) {
    return await TokensRepository.getToken(token)
  },

  async setExpiredToken(token: string) {
    return await TokensRepository.setToken(token)
  }
}
