import { FastifyInstance } from 'fastify'
import { jwtVerify } from '../../middlewares/verify-jwt'
import { search } from './search'
import { searchNearby } from './nearby'
import { create } from './create'

export async function gymsRoutes(app: FastifyInstance) {
  app.addHook('onRequest', jwtVerify)

  app.get('/gyms/search', search)
  app.get('/gyms/nearby', searchNearby)

  app.post('/gyms', create)
}
