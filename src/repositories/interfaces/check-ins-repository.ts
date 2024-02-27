import { Checkin, Prisma } from '@prisma/client'

export interface ICheckInsRepository {
  create(data: Prisma.CheckinUncheckedCreateInput): Promise<Checkin>
  save(checkIn: Checkin): Promise<Checkin>
  findByUserIdOnDate(userId: string, date: Date): Promise<Checkin | null>
  findManyByUserId(userId: string, page: number): Promise<Checkin[]>
  findById(checkInId: string): Promise<Checkin | null>
  countByUserId(userId: string): Promise<number>
}
