import { v4 } from 'uuid'
import add from 'date-fns/add'
import { CreateDeviceDto } from '../dtos/devices/create-device.dto'

export class Device {
  deviceId: string
  lastActiveDate: string
  expiredDate: string
  ip: string
  userId: string
  title: string

  constructor(data: CreateDeviceDto) {
    const timeStamp = new Date()
    const { ip, userId, title } = data

    this.ip = ip
    this.userId = userId
    this.title = title
    this.deviceId = v4()
    this.lastActiveDate = timeStamp.toISOString()
    this.expiredDate = add(timeStamp, {
      seconds: 20
    }).toISOString()
  }
}

export interface IDevice {
  ip: string
  deviceId: string
  title: string
  userId: string
  lastActiveDate: string
  expiredDate: string
}
