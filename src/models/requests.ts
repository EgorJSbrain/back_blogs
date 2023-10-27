import { Schema, model } from 'mongoose'
import { IRequest } from '../types/requests'

const RequestSchema = new Schema<IRequest>({
  id: { type: String, required: true },
  ip: { type: String, required: true },
  url: { type: String, required: true },
  date: { type: String, required: true }
})

export const Request = model('requests', RequestSchema)
