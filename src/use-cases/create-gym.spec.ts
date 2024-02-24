import { expect, describe, it, beforeEach } from 'vitest'
import { CreateGymUseCase } from './create-gym'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'

let gymsRepository: InMemoryGymsRepository
let sut: CreateGymUseCase

describe('create gym use case testes', () => {
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new CreateGymUseCase(gymsRepository)
  })

  it('deve ser possível criar uma academia', async () => {
    const { gym } = await sut.execute({
      name: 'Academia Teste',
      description: null,
      phone: null,
      latitude: -23.563987,
      longitude: -46.653127,
    })

    // valida se o id do usuário criado é uma string
    expect(gym.id).toEqual(expect.any(String))
  })
})
