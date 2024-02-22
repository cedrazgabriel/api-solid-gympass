import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { AuthenticateUseCase } from './authenticate'
import { hash } from 'bcryptjs'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'

let usersRepository: InMemoryUsersRepository
let sut: AuthenticateUseCase

describe('authenticate use case testes', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new AuthenticateUseCase(usersRepository)
  })
  it('deve ser possível autenticar', async () => {
    await usersRepository.create({
      name: 'Fulano',
      email: 'fulano@gmail.com',
      password_hash: await hash('123456', 6),
    })

    const { user } = await sut.execute({
      email: 'fulano@gmail.com',
      password: '123456',
    })

    // valida se o id do usuário autenticado é uma string
    expect(user.id).toEqual(expect.any(String))
  })

  it('não deve ser possível se autenticar com e-mail incorreto', async () => {
    await usersRepository.create({
      name: 'Fulano',
      email: 'fulano@gmail.com',
      password_hash: await hash('123456', 6),
    })

    await expect(() => {
      return sut.execute({
        email: 'fulanoemailerrado@gmail.com',
        password: '123456',
      })
    }).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('não deve ser possível se autenticar com senha incorreta', async () => {
    await usersRepository.create({
      name: 'Fulano',
      email: 'fulano@gmail.com',
      password_hash: await hash('123456', 6),
    })

    await expect(() => {
      return sut.execute({
        email: 'fulano@gmail.com',
        password: 'senhaincorreta',
      })
    }).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})
