import { PrismaUsersRepository } from '@/repositories/implementations/prisma-users-repository'
import { AuthenticateUseCase } from '../authenticate'

export function makeAuthenticateUseCase() {
  const usersRepository = new PrismaUsersRepository()

  const authenticateUseCase = new AuthenticateUseCase(usersRepository)

  return authenticateUseCase
}
