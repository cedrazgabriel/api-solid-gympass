import { PrismaGymsRepository } from '@/repositories/implementations/prisma-gyms-repository'
import { SearchGymUseCase } from '../search-gym'

export function makeSearchGymUseCase() {
  const gymsRepository = new PrismaGymsRepository()

  const searchGymUseCase = new SearchGymUseCase(gymsRepository)

  return searchGymUseCase
}
