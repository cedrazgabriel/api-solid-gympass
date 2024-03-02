import { Environment } from 'vitest'

export default <Environment>{
  name: 'prisma',
  transformMode: 'ssr',
  async setup() {
    console.log('hello from enviroment vitest')

    return {
      async teardown() {
        console.log('bye from enviroment vitest')
      },
    }
  },
}
