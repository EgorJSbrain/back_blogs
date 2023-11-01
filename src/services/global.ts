import { GlobalRepository } from '../repositories'

export class GlobalService {
  constructor(protected globalRepository: GlobalRepository) {}

  async deleteAll(): Promise<boolean> {
    try {
      await this.globalRepository.deleteAll()

      return true
    } catch {
      return false
    }
  }
}
