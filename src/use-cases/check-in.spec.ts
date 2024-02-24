import { expect, describe, it, beforeEach, vi, afterEach } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { CheckInUseCase } from './check-in'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { Decimal } from '@prisma/client/runtime/library'

let checkInsRepository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymsRepository
let sut: CheckInUseCase

const userLatitude = -12.7238144
const userLongitude = -38.305792

const gymLatitude = -12.5454134
const gymLongitude = -38.0243115

describe('register use case testes', () => {
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository()
    gymsRepository = new InMemoryGymsRepository()
    sut = new CheckInUseCase(checkInsRepository, gymsRepository)

    gymsRepository.items.push({
      id: 'gym-id-01',
      description: 'Gym 01',
      name: 'Gym 01',
      latitude: new Decimal(userLatitude), // Uso a mesma latitude do usuário para garantir que ele está próximo
      longitude: new Decimal(userLongitude), // Uso a mesma longitude do usuário para garantir que ele está próximo
      phone: '71999999999',
    })

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('deve ser possível realizar check-in', async () => {
    const { checkIn } = await sut.execute({
      gymId: 'gym-id-01',
      userId: 'user-id-01',
      userLatitude,
      userLongitude,
    })

    // valida se o id do usuário criado é uma string
    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('não deve ser possível realizar check-in em uma academia distante', async () => {
    gymsRepository.items.push({
      id: 'gym-id-02',
      description: 'Gym 02',
      name: 'Gym 02',
      latitude: new Decimal(gymLatitude),
      longitude: new Decimal(gymLongitude),
      phone: '71999999999',
    })

    await expect(() =>
      sut.execute({
        gymId: 'gym-id-02',
        userId: 'user-id-01',
        userLatitude,
        userLongitude,
      }),
    ).rejects.toBeInstanceOf(Error)
  })

  it(' não deve ser possível realizar check-in duas vezes no mesmo dia', async () => {
    // Isso serve para setar uma data global entre as requisições e forçar o checkin a ser feito no mesmo dia
    vi.setSystemTime(new Date(2022, 1, 24, 8, 0, 0))

    await sut.execute({
      gymId: 'gym-id-01',
      userId: 'user-id-01',
      userLatitude,
      userLongitude,
    })

    await expect(() =>
      sut.execute({
        gymId: 'gym-id-01',
        userId: 'user-id-01',
        userLatitude,
        userLongitude,
      }),
    ).rejects.toBeInstanceOf(Error)
  })

  it('deve ser possível realizar check-in em duas datas diferentes', async () => {
    // Isso serve para setar uma data global entre as requisições e forçar o checkin a ser feito no mesmo dia
    vi.setSystemTime(new Date(2022, 1, 24, 8, 0, 0))

    await sut.execute({
      gymId: 'gym-id-01',
      userId: 'user-id-01',
      userLatitude,
      userLongitude,
    })

    // Setar a data diferente para permitir checkin
    vi.setSystemTime(new Date(2022, 1, 25, 8, 0, 0))

    const { checkIn } = await sut.execute({
      gymId: 'gym-id-01',
      userId: 'user-id-01',
      userLatitude,
      userLongitude,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })
})
