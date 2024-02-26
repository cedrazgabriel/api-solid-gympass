import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { FetchNearbyGymsUseCase } from './fetch-nearby-gyms'

let gymsRepository: InMemoryGymsRepository
let sut: FetchNearbyGymsUseCase

describe('fetch nearby gyms use case testes', () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new FetchNearbyGymsUseCase(gymsRepository)
  })

  it('deve ser possível obter uma lista de academias próximas (10km)', async () => {
    // Criar uma academia próxima
    await gymsRepository.create({
      name: 'Academia Proxima',
      description: null,
      phone: null,
      latitude: -12.8872131,
      longitude: -38.3196191,
    })

    // Criar uma academia distante
    await gymsRepository.create({
      name: 'Academia Distante',
      description: null,
      phone: null,
      latitude: -23.563987,
      longitude: -46.653127,
    })

    const { gyms } = await sut.execute({
      userLatitude: -12.8875478,
      userLongitude: -38.3197479,
    })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([
      expect.objectContaining({ name: 'Academia Proxima' }),
    ])
  })
})
