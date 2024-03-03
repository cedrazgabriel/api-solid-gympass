import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { app } from '@/app'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'

describe('Search nearby gyms e2e tests', () => {
  // Esperar o app ficar pronto
  beforeAll(async () => {
    await app.ready()
  })

  // Garantir que depois que os testes executarem, aguardar o app fechar
  afterAll(async () => {
    await app.close()
  })

  it('deve ser possível buscar academias próximas ao usuário', async () => {
    const { token } = await createAndAuthenticateUser(app)

    // Cria uma academia próxima
    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Academia de Cicrano',
        description: 'Descricao de teste',
        phone: '5571991747951',
        latitude: -12.8872131,
        longitude: -38.3196191,
      })

    // Cria uma academia longe
    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Academia de fulano',
        description: 'Descricao de teste2',
        phone: '5571991747951',
        latitude: -23.563987,
        longitude: -46.653127,
      })

    const response = await request(app.server)
      .get('/gyms/nearby')
      .query({
        latitude: -23.563987,
        longitude: -46.653127,
      })
      .set('Authorization', `Bearer ${token}`)

    expect(response.statusCode).toEqual(200)
    expect(response.body.gyms).toHaveLength(1)
    expect(response.body.gyms).toEqual([
      expect.objectContaining({
        name: 'Academia de fulano',
      }),
    ])
  })
})
