import { expect, describe, it } from 'vitest'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { AuthenticateUseCase } from './authenticate'
import { hash } from 'bcryptjs'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'

describe('authenticate use case testes', () => {
  it('deve ser possível autenticar', async () => {
    const usersRepositoryInMemory = new InMemoryUsersRepository()
    const sut = new AuthenticateUseCase(usersRepositoryInMemory)

    await usersRepositoryInMemory.create({
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
    const usersRepositoryInMemory = new InMemoryUsersRepository()
    const sut = new AuthenticateUseCase(usersRepositoryInMemory)

    await usersRepositoryInMemory.create({
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
    const usersRepositoryInMemory = new InMemoryUsersRepository()
    const sut = new AuthenticateUseCase(usersRepositoryInMemory)

    await usersRepositoryInMemory.create({
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
