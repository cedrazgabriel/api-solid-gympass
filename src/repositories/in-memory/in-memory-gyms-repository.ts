import { Gym, Prisma } from '@prisma/client'
import { IGymsRepository } from '../interfaces/gyms-repository'
import { randomUUID } from 'crypto'

export class InMemoryGymsRepository implements IGymsRepository {
  public items: Gym[] = []

  async create(data: Prisma.GymCreateInput) {
    const gym = {
      id: data.id ?? randomUUID(),
      name: data.name,
      description: data.description ?? null,
      phone: data.phone ?? null,
      latitude: new Prisma.Decimal(data.latitude.toString()),
      longitude: new Prisma.Decimal(data.longitude.toString()),
      created_at: new Date(),
    }

    this.items.push(gym)

    return gym
  }

  async findById(gymId: string) {
    const gym = this.items.find((gym) => gym.id === gymId)

    if (!gym) {
      return null
    }

    return gym
  }

  async searchMany(query: string, page: number) {
    return this.items
      .filter((gym) => gym.name.includes(query))
      .slice((page - 1) * 20, page * 20)
  }
}
