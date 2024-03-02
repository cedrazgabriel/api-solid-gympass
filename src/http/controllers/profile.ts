import { FastifyRequest, FastifyReply } from 'fastify'

export async function profile(request: FastifyRequest, reply: FastifyReply) {
  // Verificar o token JWT e adicionar na variável request.user
  await request.jwtVerify()

  console.log(request.user.sub)

  return reply.status(200).send()
}
