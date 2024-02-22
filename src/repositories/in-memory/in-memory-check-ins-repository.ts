import { Checkin, Prisma } from '@prisma/client'
import { ICheckInsRepository } from '../interfaces/check-ins-repository'
import { randomUUID } from 'node:crypto'

export class InMemoryCheckInsRepository implements ICheckInsRepository {
  public items: Checkin[] = []

  async create(data: Prisma.CheckinUncheckedCreateInput) {
    const checkIn = {
      id: randomUUID(),
      user_id: data.user_id,
      created_at: new Date(),
      validated_at: data.validated_at ? new Date(data.validated_at) : null,
      gym_id: data.gym_id,
    }

    this.items.push(checkIn)

    return checkIn
  }
}
