import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { FetchUserCheckInsHistoryUseCase } from './fetch-user-check-ins-history'

let checkInsRepository: InMemoryCheckInsRepository
let sut: FetchUserCheckInsHistoryUseCase

describe('fetch users check-ins use case testes', () => {
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()
    sut = new FetchUserCheckInsHistoryUseCase(checkInsRepository)
  })

  it('deve ser possível obter o histórico de check-ins de um usuário', async () => {
    // Criar dois check-ins para o mesmo usuário em academias diferentes
    await checkInsRepository.create({
      gym_id: 'gym-id-01',
      user_id: 'user-id-01',
    })

    await checkInsRepository.create({
      gym_id: 'gym-id-02',
      user_id: 'user-id-01',
    })

    const { checkIns } = await sut.execute({
      userId: 'user-id-01',
      page: 1,
    })

    expect(checkIns).toHaveLength(2)
    expect(checkIns).toEqual([
      expect.objectContaining({ gym_id: 'gym-id-01' }),
      expect.objectContaining({ gym_id: 'gym-id-02' }),
    ])
  })

  it('deve ser possível obter uma lista páginada do histórico de check-ins de um usuário', async () => {
    // Como a regra de paginação é de 20 itens por página, vamos criar 22 check-ins para o mesmo usuário
    for (let i = 1; i < 23; i++) {
      await checkInsRepository.create({
        gym_id: `gym-id-${i}`,
        user_id: 'user-id-01',
      })
    }

    const { checkIns } = await sut.execute({
      userId: 'user-id-01',
      page: 2,
    })

    expect(checkIns).toHaveLength(2)
    expect(checkIns).toEqual([
      expect.objectContaining({ gym_id: 'gym-id-21' }),
      expect.objectContaining({ gym_id: 'gym-id-22' }),
    ])
  })
})
