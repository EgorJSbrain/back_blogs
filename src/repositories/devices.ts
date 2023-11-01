import { Device } from '../models'
import { IDevice } from '../types/devices'

export class DevicesRepository {
  async getAllDevicesByUserId(userId: string): Promise<IDevice[] | null> {
    try {
      const tokens = await Device.find(
        { userId },
        { projection: { _id: 0, expiredDate: 0, userId: 0 } }
      ).lean()

      return tokens
    } catch {
      return null
    }
  }

  async getDeviceByDate(lastActiveDate: string): Promise<IDevice | null> {
    try {
      const token = await Device.findOne(
        { lastActiveDate },
        { projection: { _id: 0 } }
      )

      return token
    } catch {
      return null
    }
  }

  async getTokenByDeviceId(deviceId: string, deviceTitle: string): Promise<IDevice | null> {
    try {
      const token = await Device.findOne(
        { deviceId },
        { projection: { _id: 0 } }
      )

      return token
    } catch {
      return null
    }
  }

  async createRefreshToken(token: IDevice): Promise<boolean> {
    try {
      const response = await Device.create(token)

      return !!response._id
    } catch {
      return false
    }
  }

  async updateDevice(
    prevDate: string,
    currentDate: string,
    newExpiredDate: string
  ): Promise<IDevice | null> {
    try {
      let updatedDevice = null
      const response = await Device.updateOne(
        { lastActiveDate: prevDate },
        { $set: { lastActiveDate: currentDate, expiredDate: newExpiredDate } }
      )

      if (response.modifiedCount) {
        updatedDevice = await Device.findOne(
          { lastActiveDate: currentDate },
          { projection: { _id: 0 } }
        )
      }

      return updatedDevice
    } catch {
      return null
    }
  }

  async deleteDevices(
    userId: string,
    lastActiveDate: string
  ): Promise<boolean> {
    try {
      const response = await Device.deleteMany({
        userId,
        $nor: [{ lastActiveDate }]
      })

      return !!response.deletedCount
    } catch {
      return false
    }
  }

  async deleteDevice(deviceId: string): Promise<boolean> {
    try {
      const response = await Device.deleteOne({ deviceId })

      return !!response.deletedCount
    } catch {
      return false
    }
  }
}
