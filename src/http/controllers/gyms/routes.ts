import { FastifyInstance } from 'fastify'
import { jwtVerify } from '../../middlewares/verify-jwt'
import { search } from './search'
import { searchNearby } from './nearby'
import { create } from './create'
import { verifyUserRole } from '@/http/middlewares/verify-user-role'

export async function gymsRoutes(app: FastifyInstance) {
  app.addHook('onRequest', jwtVerify)

  app.get('/gyms/search', search)
  app.get('/gyms/nearby', searchNearby)

  app.post('/gyms', { onRequest: [verifyUserRole('ADMIN')] }, create)
}
