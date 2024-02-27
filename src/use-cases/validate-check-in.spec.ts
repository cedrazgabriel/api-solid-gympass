import { expect, describe, it, beforeEach, afterEach } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { ValidateCheckInUseCase } from './validate-check-in'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

let checkInsRepository: InMemoryCheckInsRepository
let sut: ValidateCheckInUseCase

describe('validate check-in use case testes', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()
    sut = new ValidateCheckInUseCase(checkInsRepository)

    // vi.useFakeTimers()
  })

  afterEach(() => {
    // vi.useRealTimers()
  })

  it('deve ser possível validar um check-in', async () => {
    const createdCheckIn = await checkInsRepository.create({
      gym_id: 'gym-id-01',
      user_id: 'user-id-01',
    })

    const { checkIn } = await sut.execute({ checkInId: createdCheckIn.id })

    // valida se o id do usuário criado é uma string
    expect(checkIn.validated_at).toEqual(expect.any(Date))
    expect(checkInsRepository.items[0].validated_at).toEqual(expect.any(Date))
  })

  it('não deve ser possível validar um check-in que não existe', async () => {
    await expect(() =>
      sut.execute({ checkInId: 'id não existente' }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
