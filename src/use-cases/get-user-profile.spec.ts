import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { hash } from 'bcryptjs'
import { GetUserProfileUseCase } from './get-user-profile'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

let usersRepository: InMemoryUsersRepository
let sut: GetUserProfileUseCase

describe('get user profile use case testes', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new GetUserProfileUseCase(usersRepository)
  })

  it('deve ser possível obter o perfil do usuário', async () => {
    const createdUser = await usersRepository.create({
      name: 'Fulano',
      email: 'fulano@gmail.com',
      password_hash: await hash('123456', 6),
    })

    const { user } = await sut.execute({
      userId: createdUser.id,
    })

    expect(user.id).toEqual(expect.any(String))
    expect(user.name).toEqual('Fulano')
  })

  it('não deve ser possível obter perfil com userId errado e/ou inexistente', async () => {
    await expect(() => {
      return sut.execute({
        userId: 'id-nao-existente',
      })
    }).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
