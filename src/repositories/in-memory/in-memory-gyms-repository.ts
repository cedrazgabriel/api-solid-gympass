import { Gym } from '@prisma/client'
import { IGymsRepository } from '../interfaces/gyms-repository'

export class InMemoryGymsRepository implements IGymsRepository {
  public items: Gym[] = []

  async findById(gymId: string) {
    const gym = this.items.find((gym) => gym.id === gymId)

    if (!gym) {
      return null
    }

    return gym
  }
}
