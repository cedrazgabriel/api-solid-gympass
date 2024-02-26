import { Checkin, Prisma } from '@prisma/client'

export interface ICheckInsRepository {
  create(data: Prisma.CheckinUncheckedCreateInput): Promise<Checkin>
  findByUserIdOnDate(userId: string, date: Date): Promise<Checkin | null>
  countByUserId(userId: string): Promise<number>
  findManyByUserId(userId: string, page: number): Promise<Checkin[]>
}
