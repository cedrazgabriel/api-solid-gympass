import { Checkin } from '@prisma/client'
import { ICheckInsRepository } from '@/repositories/interfaces/check-ins-repository'

interface FetchUserCheckInsHistoryUseCaseRequest {
  userId: string
  page: number
}

interface FetchUserCheckInsHistoryUseCaseResponse {
  checkIns: Checkin[]
}

export class FetchUserCheckInsHistoryUseCase {
  constructor(private readonly checkInsRepository: ICheckInsRepository) {}

  private readonly MAX_DISTANCE = 0.1

  async execute({
    userId,
    page,
  }: FetchUserCheckInsHistoryUseCaseRequest): Promise<FetchUserCheckInsHistoryUseCaseResponse> {
    const checkIns = await this.checkInsRepository.findManyByUserId(
      userId,
      page,
    )

    return { checkIns }
  }
}
