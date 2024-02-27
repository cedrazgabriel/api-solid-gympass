import { Checkin, Prisma } from '@prisma/client'
import { ICheckInsRepository } from '../interfaces/check-ins-repository'
import { randomUUID } from 'node:crypto'
import dayjs from 'dayjs'

export class InMemoryCheckInsRepository implements ICheckInsRepository {
  public items: Checkin[] = []

  async findByUserIdOnDate(userId: string, date: Date) {
    // isso retorna a data e hora do início do dia (ignorando as horas passadas) ou seja, data + 00:00:00
    const startOfTheDay = dayjs(date).startOf('date')

    // isso retorna a data e hora do fim do dia (ignorando as horas passadas) ou seja, data + 23:59:59
    const endOfTheDay = dayjs(date).endOf('date')

    const checkInOnSameDate = this.items.find((checkIn) => {
      const checkInDate = dayjs(checkIn.created_at)
      const isOnSameDate =
        checkInDate.isAfter(startOfTheDay) && checkInDate.isBefore(endOfTheDay)
      return checkIn.user_id === userId && isOnSameDate
    })

    if (!checkInOnSameDate) return null

    return checkInOnSameDate
  }

  async findManyByUserId(userId: string, page: number) {
    return this.items
      .filter((checkIn) => checkIn.user_id === userId)
      .slice((page - 1) * 20, page * 20)
  }

  async findById(checkInId: string) {
    const checkIn = this.items.find((checkIn) => checkIn.id === checkInId)

    if (!checkIn) return null

    return checkIn
  }

  async countByUserId(userId: string) {
    return this.items.filter((checkIn) => checkIn.user_id === userId).length
  }

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

  async save(checkIn: Checkin) {
    const checkInIndex = this.items.findIndex((item) => item.id === checkIn.id)

    if (checkInIndex >= 0) {
      this.items[checkInIndex] = checkIn
    }

    return checkIn
  }
}
