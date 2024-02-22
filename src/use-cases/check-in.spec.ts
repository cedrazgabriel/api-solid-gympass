import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { CheckInUseCase } from './check-in'

let checkInsRepository: InMemoryCheckInsRepository
let sut: CheckInUseCase

describe('register use case testes', () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository()
    sut = new CheckInUseCase(checkInsRepository)
  })

  it('deve ser possível realizar check-in', async () => {
    const { checkIn } = await sut.execute({
      gymId: 'gym-id-01',
      userId: 'user-id-01',
    })

    // valida se o id do usuário criado é uma string
    expect(checkIn.id).toEqual(expect.any(String))
  })
})
