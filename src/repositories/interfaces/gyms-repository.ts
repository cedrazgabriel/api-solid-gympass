import { Gym, Prisma } from '@prisma/client'

export interface IGymsRepository {
  create(data: Prisma.GymCreateInput): Promise<Gym>
  findById(userId: string): Promise<Gym | null>
  searchMany(query: string, page: number): Promise<Gym[]>
}
