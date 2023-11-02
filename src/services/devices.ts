import add from 'date-fns/add'
import { JwtService } from '../applications/jwt-service'
import { DevicesRepository } from '../repositories'
import { Device, IDevice } from '../types/devices'
import { CreateDeviceDto } from '../dtos/devices/create-device.dto'

export class DevicesService {
  constructor(protected devicesRepository: DevicesRepository) {}

  async getAllDevices(userId: string): Promise<IDevice[] | null> {
    return await this.devicesRepository.getAllDevicesByUserId(userId)
  }

  async getDevice(token: string): Promise<IDevice | null> {
    const { lastActiveDate } = JwtService.decodeRefreshToken(token)

    return await this.devicesRepository.getDeviceByDate(lastActiveDate)
  }

  async getDeviceByDeviceId(deviceId: string): Promise<IDevice | null> {
    return await this.devicesRepository.getDeviceByDeviceId(deviceId)
  }

  async createDevice(data: CreateDeviceDto): Promise<IDevice | null> {
    const newDevice = new Device(data)

    await this.devicesRepository.createDevice(newDevice)

    return newDevice
  }

  async updateDevice(date: string): Promise<IDevice | null> {
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
