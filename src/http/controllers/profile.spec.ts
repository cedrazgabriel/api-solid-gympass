import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { app } from '@/app'

describe('Profile e2e tests', () => {
  // Esperar o app ficar pronto
  beforeAll(async () => {
    await app.ready()
  })

  // Garantir que depois que os testes executarem, aguardar o app fechar
  afterAll(async () => {
    await app.close()
  })

  it('deve ser possível obter o perfil do usuário', async () => {
    await request(app.server).post('/users').send({
      name: 'Fulano da Silva',
      email: 'fulano@gmail.com',
      password: '12345566',
    })

    const authResponse = await request(app.server).post('/sessions').send({
      email: 'fulano@gmail.com',
      password: '12345566',
    })

    const { token } = authResponse.body

    const profileResponse = await request(app.server)
      .get('/me')
      .set('Authorization', `Bearer ${token}`)
      .send()

    expect(profileResponse.statusCode).toEqual(200)
    expect(profileResponse.body.user).toEqual(
      expect.objectContaining({
        email: 'fulano@gmail.com',
      }),
    )
  })
})
