import { Schema, model } from 'mongoose'
import { IDevice } from '../types/devices'

const DeviceSchema = new Schema<IDevice>({
  ip: { type: String, required: true },
  deviceId: { type: String, required: true },
  title: { type: String, required: true },
  userId: { type: String, required: true },
  lastActiveDate: { type: String, required: true },
  expiredDate: { type: String, required: true }
})

export const Device = model('devices', DeviceSchema)
