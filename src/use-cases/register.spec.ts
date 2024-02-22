import { expect, describe, it, beforeEach } from 'vitest'
import { RegisterUseCase } from './register'
import { compare } from 'bcryptjs'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'

let usersRepository: InMemoryUsersRepository
let sut: RegisterUseCase

describe('register use case testes', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new RegisterUseCase(usersRepository)
  })

  it('deve ser possível se cadastrar', async () => {
    const { user } = await sut.execute({
      name: 'Fulano',
      email: 'fulano@fulano.com.br',
      password: 'senhaqualquer1234',
    })

    // valida se o id do usuário criado é uma string
    expect(user.id).toEqual(expect.any(String))
  })

  it('a senha do usuário deve ser hasheada no cadastro', async () => {
    const { user } = await sut.execute({
      name: 'Fulano',
      email: 'fulano@fulano.com.br',
      password: 'senhaqualquer1234',
    })

    const isPasswordCorrectlyHashed = await compare(
      'senhaqualquer1234',
      user.password_hash,
    )

    expect(isPasswordCorrectlyHashed).toBe(true)
  })

  it('não deve ser possível criar um usuário com e-mail repetido', async () => {
    const email = 'fulano@fulano.com.br'

    await sut.execute({
      name: 'Fulano',
      email,
      password: 'senhaqualquer1234',
    })

    await expect(() => {
      return sut.execute({
        name: 'Fulano 2 ',
        email,
        password: 'senhanumerodois',
      })
    }).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })
})
