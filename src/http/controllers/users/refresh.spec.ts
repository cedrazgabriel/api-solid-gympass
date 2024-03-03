import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { app } from '@/app'

describe('Refresh token e2e tests', () => {
  // Esperar o app ficar pronto
  beforeAll(async () => {
    await app.ready()
  })

  // Garantir que depois que os testes executarem, aguardar o app fechar
  afterAll(async () => {
    await app.close()
  })

  it('deve ser possível obter um novo token', async () => {
    await request(app.server).post('/users').send({
      name: 'Fulano da Silva',
      email: 'fulano@gmail.com',
      password: '12345566',
    })

    const authResponse = await request(app.server).post('/sessions').send({
      email: 'fulano@gmail.com',
      password: '12345566',
    })

    const cookies = authResponse.get('Set-Cookie')

    const response = await request(app.server)
      .patch('/token/refresh')
      .set('Cookie', cookies)
      .send()

    expect(response.statusCode).toEqual(200)
    expect(response.body).toEqual({
      token: expect.any(String),
    })
    expect(response.get('Set-Cookie')).toEqual([
      expect.stringContaining('refreshToken='),
    ])
  })
})
