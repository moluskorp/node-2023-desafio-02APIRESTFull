import { FastifyInstance } from 'fastify'
import { knex } from '../database'
import { z } from 'zod'
import { randomUUID } from 'crypto'

export async function usersRoutes(app: FastifyInstance) {
  app.get('/', async () => {
    const users = await knex('users').select()

    return {
      users,
    }
  })

  app.get('/:id', async (request) => {
    const schema = z.object({
      id: z.string().uuid(),
    })

    const { id } = schema.parse(request.params)
    const user = await knex('users').where({ id }).first()

    return { user }
  })

  app.post('/', async (request, reply) => {
    const bodySchema = z.object({
      name: z.string(),
      username: z.string(),
      password: z.string(),
    })

    const { name, username, password } = bodySchema.parse(request.body)

    await knex('users').insert({
      id: randomUUID(),
      name,
      username,
      password,
    })

    return reply.status(201).send()
  })
}

const oi = ['oi', 'oi']

if (oi.length > 1) {
  console.log('oie')
}
