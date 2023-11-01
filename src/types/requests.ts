export class Request {
  id: string
  date: string

  constructor (
    public ip: string,
    public url: string
  ) {
    this.id = Number(new Date()).toString()
    this.date = new Date().toISOString()
  }
}

export interface IRequest {
  id: string
  ip: string
  url: string
  date: string
}
