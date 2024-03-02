import 'dotenv/config'

import { randomUUID } from 'node:crypto'
import { execSync } from 'node:child_process'
import { Environment } from 'vitest'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

/*
Essa função serve para pegar a url do banco de dados no arquivo .env e trocar
o schema para um uuid aleatório.
O postgres permite que tenhamos mais de um esquema no mesmo banco de dados,
garantindo assim que cada switch de testes rode com um schema único.
*/
function generateDataBaseURL(schema: string) {
  if (!process.env.DATABASE_URL) {
    throw new Error(
      'Por favor adicione a variável DATABASE_URL ao arquivo .env ',
    )
  }

  const url = new URL(process.env.DATABASE_URL)

  url.searchParams.set('schema', schema)

  return url.toString()
}

export default <Environment>{
  name: 'prisma',
  transformMode: 'ssr',
  async setup() {
    // Cria um uuid
    const schema = randomUUID()

    // Cria uma nova url com um novo schema
    const databaseURL = generateDataBaseURL(schema)

    process.env.DATABASE_URL = databaseURL

    // Usamos o migrate deploy para o prisma não comparar alterações (como é feito no migrate dev)
    execSync('npx prisma migrate deploy')

    return {
      async teardown() {
        // Apagar o schema criado manualmente
        await prisma.$executeRawUnsafe(
          `DROP SCHEMA IF EXISTS "${schema}" CASCADE `,
        )
        await prisma.$disconnect()
      },
    }
  },
}
