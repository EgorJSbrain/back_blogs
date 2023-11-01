import add from 'date-fns/add'
import { JwtService } from '../applications/jwt-service'
import { CreateRefreshTokenDto } from '../dtos/tokens/create-refresh-token.dto'
import { DevicesRepository } from '../repositories'
import { generateNewRefreshToken } from './utils'
import { IDevice } from '../types/devices'

export class DevicesService {
  constructor(protected devicesRepository: DevicesRepository) {}

  async getAllDevices(userId: string): Promise<IDevice[] | null> {
    return await this.devicesRepository.getAllDevicesByUserId(userId)
  }

  async getDevice(token: string): Promise<IDevice | null> {
    const { lastActiveDate } = JwtService.decodeRefreshToken(token)

    return await this.devicesRepository.getDeviceByDate(lastActiveDate)
  }

  async getDeviceByDeviceId(deviceId: string, deviceTitle: string): Promise<IDevice | null> {
    return await this.devicesRepository.getTokenByDeviceId(deviceId, deviceTitle)
  }

  async createRefreshToken(data: CreateRefreshTokenDto): Promise<IDevice | null> {
    const newRefreshToken = generateNewRefreshToken(data)

    await this.devicesRepository.createRefreshToken(newRefreshToken)

    return newRefreshToken
  }

  async updateRefreshToken(date: string): Promise<IDevice | null> {
    const newDate = new Date()
    const newExpiredDate = add(newDate, {
      seconds: 20
    }).toISOString()

    return await this.devicesRepository.updateDevice(
      date,
      newDate.toISOString(),
      newExpiredDate
    )
  }

  async deleteDevices(token: string): Promise<boolean> {
    const { lastActiveDate, userId } = JwtService.decodeRefreshToken(token)

    return await this.devicesRepository.deleteDevices(userId, lastActiveDate)
  }

  async deleteDevice(deviceId: string): Promise<boolean> {
    return await this.devicesRepository.deleteDevice(deviceId)
  }
}
