import { PrismaCheckInRepository } from '@/repositories/implementations/prisma-check-ins-repository'
import { CheckInUseCase } from '../check-in'
import { PrismaGymsRepository } from '@/repositories/implementations/prisma-gyms-repository'

export function makeCheckInUseCase() {
  const checkInsRepository = new PrismaCheckInRepository()
  const gymsRepository = new PrismaGymsRepository()

  const checkInUseCase = new CheckInUseCase(checkInsRepository, gymsRepository)

  return checkInUseCase
}
