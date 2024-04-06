import { Checkin } from '@prisma/client'
import { ICheckInsRepository } from '@/repositories/interfaces/check-ins-repository'
import { IGymsRepository } from '@/repositories/interfaces/gyms-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { getDistanceBetweenCoordinates } from '@/utils/get-distance-between-coordinates'
import { MaxDistanceError } from './errors/max-distance-error'
import { MaxNumberOfCheckinsError } from './errors/max-number-of-checkins-error'

interface CheckInUseCaseRequest {
  userId: string
  userLatitude: number
  userLongitude: number
  gymId: string
}

interface CheckInUseCaseResponse {
  checkIn: Checkin

  
}

export class CheckInUseCase {
  constructor(
    private readonly checkInsRepository: ICheckInsRepository,
    private readonly gymsRepository: IGymsRepository,
  ) {}

  private readonly MAX_DISTANCE = 0.1

  async execute({
    userId,
    userLatitude,
    userLongitude,
    gymId,
  }: CheckInUseCaseRequest): Promise<CheckInUseCaseResponse> {
    const gym = await this.gymsRepository.findById(gymId)

    if (!gym) {
      throw new ResourceNotFoundError()
    }

    // Calcular a distância entre o usuário e a academia
    // Se a distância for maior que 100m, lançar um erro
    const distance = getDistanceBetweenCoordinates(
      { latitude: userLatitude, longitude: userLongitude },
      {
        latitude: gym.latitude.toNumber(),
        longitude: gym.longitude.toNumber(),
      },
    )

    if (distance > this.MAX_DISTANCE) {
      throw new MaxDistanceError()
    }

    const checkInOnSameDate = await this.checkInsRepository.findByUserIdOnDate(
      userId,
      new Date(),
    )

    if (checkInOnSameDate) {
      throw new MaxNumberOfCheckinsError()
    }

    const checkIn = await this.checkInsRepository.create({
      gym_id: gymId,
      user_id: userId,
    })

    return { checkIn }
  }
}
