import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { app } from '@/app'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'
import { prisma } from '@/lib/prisma'

describe('Create check-in e2e tests', () => {
  // Esperar o app ficar pronto
  beforeAll(async () => {
    await app.ready()
  })

  // Garantir que depois que os testes executarem, aguardar o app fechar
  afterAll(async () => {
    await app.close()
  })

  it('deve ser possível criar um check-in', async () => {
    const { token } = await createAndAuthenticateUser(app)

    const gym = await prisma.gym.create({
      data: {
        name: 'Academia de Cedraz',
        latitude: -23.563987,
        longitude: -46.653127,
      },
    })

    const response = await request(app.server)
      .post(`/gyms/${gym.id}/check-ins`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        latitude: -23.563987,
        longitude: -46.653127,
      })

    expect(response.statusCode).toEqual(201)
  })
})
