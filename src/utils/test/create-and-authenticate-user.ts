import { FastifyInstance } from 'fastify'
import request from 'supertest'

export async function createAndAuthenticateUser(app: FastifyInstance) {
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

  return {
    token,
  }
}
