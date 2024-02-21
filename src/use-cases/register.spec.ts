import { expect, describe, it } from 'vitest'
import { RegisterUseCase } from './register'
import { compare } from 'bcryptjs'

describe('register use case testes', () => {
  it('a senha do usuário deve ser hasheada no cadastro', async () => {
    const registerUseCase = new RegisterUseCase({
      // eslint-disable-next-line
      async findByEmail(email) {
        return null
      },

      async create(data) {
        return {
          id: 'user-1',
          name: data.name,
          email: data.email,
          password_hash: data.password_hash,
          created_at: new Date(),
        }
      },
    })

    const { user } = await registerUseCase.execute({
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
})
