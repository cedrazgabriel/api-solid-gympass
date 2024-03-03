import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { app } from '@/app'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user'
import { prisma } from '@/lib/prisma'

describe('check-in history e2e tests', () => {
  // Esperar o app ficar pronto
  beforeAll(async () => {
    await app.ready()
  })

  // Garantir que depois que os testes executarem, aguardar o app fechar
  afterAll(async () => {
    await app.close()
  })

  it('deve ser possível obter o histórico de check ins de um usuário', async () => {
    const { token } = await createAndAuthenticateUser(app)

    const user = await prisma.user.findFirstOrThrow()
    const gym = await prisma.gym.create({
      data: {
        name: 'Academia de Cedraz',
        latitude: -23.563987,
        longitude: -46.653127,
      },
    })

    await prisma.checkin.createMany({
      data: [
        {
          gym_id: gym.id,
          user_id: user.id,
        },
        {
          gym_id: gym.id,
          user_id: user.id,
        },
      ],
    })

    const response = await request(app.server)
      .get(`/check-ins/history`)
      .set('Authorization', `Bearer ${token}`)
      .send()

    console.log('aaaa', response.body)

    expect(response.statusCode).toEqual(200)
    expect(response.body.checkIns).toEqual([
      expect.objectContaining({
        gym_id: gym.id,
        user_id: user.id,
      }),
      expect.objectContaining({
        gym_id: gym.id,
        user_id: user.id,
      }),
    ])
  })
})
