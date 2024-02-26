import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { GetUserMetricsUseCase } from './get-user-metrics'

let checkInsRepository: InMemoryCheckInsRepository
let sut: GetUserMetricsUseCase

describe('get users metrics use case testes', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()
    sut = new GetUserMetricsUseCase(checkInsRepository)
  })

  it('deve ser possível obter o total de check-ins de um usuário', async () => {
    // Criar dois check-ins para o mesmo usuário em academias diferentes
    await checkInsRepository.create({
      gym_id: 'gym-id-01',
      user_id: 'user-id-01',
    })

    await checkInsRepository.create({
      gym_id: 'gym-id-02',
      user_id: 'user-id-01',
    })

    const { checkInsCount } = await sut.execute({
      userId: 'user-id-01',
    })

    expect(checkInsCount).toEqual(2)
  })
})
