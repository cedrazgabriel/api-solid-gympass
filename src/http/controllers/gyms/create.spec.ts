import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { app } from '@/app'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'

describe('Create gym e2e tests', () => {
  // Esperar o app ficar pronto
  beforeAll(async () => {
    await app.ready()
  })

  // Garantir que depois que os testes executarem, aguardar o app fechar
  afterAll(async () => {
    await app.close()
  })

  it('deve ser possível criar uma academia', async () => {
    const { token } = await createAndAuthenticateUser(app, true)

    const response = await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Academia de teste',
        description: 'Descricao de teste',
        phone: '5571991747951',
        latitude: -23.563987,
        longitude: -46.653127,
      })

    expect(response.statusCode).toEqual(201)
  })
})
