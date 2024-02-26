import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { SearchGymUseCase } from './search-gym'

let gymsRepository: InMemoryGymsRepository
let sut: SearchGymUseCase

describe('fetch users check-ins use case testes', () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new SearchGymUseCase(gymsRepository)
  })

  it('deve ser possível obter uma lista de academias', async () => {
    await gymsRepository.create({
      name: 'Academia Teste',
      description: null,
      phone: null,
      latitude: -23.563987,
      longitude: -46.653127,
    })

    await gymsRepository.create({
      name: 'Academia Teste 2',
      description: null,
      phone: null,
      latitude: -23.563987,
      longitude: -46.653127,
    })

    const { gyms } = await sut.execute({
      query: 'Teste',
      page: 1,
    })

    expect(gyms).toHaveLength(2)
    expect(gyms).toEqual([
      expect.objectContaining({ name: 'Academia Teste' }),
      expect.objectContaining({ name: 'Academia Teste 2' }),
    ])
  })

  it('deve ser possível obter uma lista páginada da consulta de academias', async () => {
    // Como a regra de paginação é de 20 itens por página, vamos criar 22 academias para o mesmo usuário
    for (let i = 1; i < 23; i++) {
      await gymsRepository.create({
        name: `Academia Teste ${i}`,
        description: null,
        phone: null,
        latitude: -23.563987,
        longitude: -46.653127,
      })
    }
    const { gyms } = await sut.execute({
      query: 'Teste',
      page: 2,
    })

    expect(gyms).toHaveLength(2)
    expect(gyms).toEqual([
      expect.objectContaining({ name: 'Academia Teste 21' }),
      expect.objectContaining({ name: 'Academia Teste 22' }),
    ])
  })
})
