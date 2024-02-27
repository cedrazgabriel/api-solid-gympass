import { Checkin, Prisma } from '@prisma/client'
import { ICheckInsRepository } from '../interfaces/check-ins-repository'
import { prisma } from '@/lib/prisma'
import dayjs from 'dayjs'

export class PrismaCheckInRepository implements ICheckInsRepository {
  async create(data: Prisma.CheckinUncheckedCreateInput) {
    const checkIn = await prisma.checkin.create({
      data,
    })

    return checkIn
  }

  async save(data: Checkin) {
    const checkIn = await prisma.checkin.update({
      where: {
        id: data.id,
      },
      data,
    })

    return checkIn
  }

  async findByUserIdOnDate(userId: string, date: Date) {
    const startOfTheDay = dayjs(date).startOf('date')
    const endOfTheDay = dayjs(date).endOf('date')

    const checkIn = await prisma.checkin.findFirst({
      where: {
        user_id: userId,
        created_at: {
          gte: startOfTheDay.toDate(),
          lte: endOfTheDay.toDate(),
        },
      },
    })

    return checkIn
  }

  async findManyByUserId(userId: string, page: number) {
    const checkIns = await prisma.checkin.findMany({
      where: {
        id: userId,
      },
      take: 20,
      skip: (page - 1) * 20,
    })

    return checkIns
  }

  async findById(checkInId: string) {
    const checkIn = await prisma.checkin.findUnique({
      where: {
        id: checkInId,
      },
    })

    return checkIn
  }

  async countByUserId(userId: string) {
    const count = await prisma.checkin.count({
      where: {
        id: userId,
      },
    })

    return count
  }
}
