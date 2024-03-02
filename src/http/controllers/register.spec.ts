import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import request from 'supertest'
import { app } from '@/app'

describe('Register e2e tests', () => {
  // Esperar o app ficar pronto
  beforeAll(async () => {
    await app.ready()
  })

  // Garantir que depois que os testes executarem, aguardar o app fechar
  afterAll(async () => {
    await app.close()
  })

  it('deve ser possível se registrar', async () => {
    const response = await request(app.server).post('/users').send({
      name: 'Fulano da Silva',
      email: 'fulano@gmail.com',
      password: '12345566',
    })

    expect(response.statusCode).toEqual(201)
  })

  it('se tentar cadastrar um usuário com o mesmo e-mail, devolve conflito', async () => {
    await request(app.server).post('/users').send({
      name: 'Fulano da Silva',
      email: 'fulano@gmail.com',
      password: '12345566',
    })

    const reponseWithUserAlreadyExists = await request(app.server)
      .post('/users')
      .send({
        name: 'Fulano da Silva',
        email: 'fulano@gmail.com',
        password: '12345566',
      })

    expect(reponseWithUserAlreadyExists.statusCode).toEqual(409)
  })
})
