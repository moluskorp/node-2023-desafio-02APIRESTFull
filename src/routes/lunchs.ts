import { FastifyInstance } from 'fastify'
import { knex } from '../database'
import { z } from 'zod'
import { randomUUID } from 'crypto'
import { checkSessionIdExists } from '../middlewares/check-session-id-exists'

export async function lunchsRoutes(app: FastifyInstance) {
  app.get(
    '/',
    {
      preHandler: [checkSessionIdExists],
    },
    async (request) => {
      const { sessionId } = request.cookies

      const lunchs = await knex('lunchs')
        .where('session_id', sessionId)
        .select()

      const numberOfLunchs = lunchs.length
      const dietLunchs = lunchs.reduce((acc, lunch) => {
        const isDiet = Boolean(lunch.in_plane)
        if (isDiet) {
          return acc + 1
        }
        return acc
      }, 0)
      const noDietLunch = numberOfLunchs - dietLunchs

      return {
        lunchs,
        numberOfLunchs,
        dietLunchs,
        noDietLunch,
      }
    },
  )

  app.get(
    '/:id',
    {
      preHandler: [checkSessionIdExists],
    },
    async (request) => {
      const schema = z.object({
        id: z.string().uuid(),
      })

      const { sessionId } = request.cookies

      const { id } = schema.parse(request.params)
      const lunch = await knex('lunchs')
        .where({ id })
        .where({ session_id: sessionId })
        .first()

      return { lunch }
    },
  )

  app.post('/', async (request, reply) => {
    const bodySchema = z.object({
      name: z.string(),
      description: z.string(),
      in_plane: z.boolean(),
    })

    const {
      name,
      description,
      in_plane: inPlane,
    } = bodySchema.parse(request.body)

    let sessionId = request.cookies.sessionId

    if (!sessionId) {
      sessionId = randomUUID()

      reply.cookie('sessionId', sessionId, {
        path: '/',
        maxAge: 1000 * 60 * 60 * 24 * 7,
      })
    }

    await knex('lunchs').insert({
      id: randomUUID(),
      name,
      description,
      in_plane: inPlane,
      session_id: sessionId,
    })
  })

  app.put('/:id', async (request, reply) => {
    const urlSchema = z.object({
      id: z.string().uuid(),
    })
    const bodySchema = z.object({
      name: z.string(),
      description: z.string(),
      in_plane: z.boolean(),
    })

    const { id } = urlSchema.parse(request.params)
    // eslint-disable-next-line
      const { name, description, in_plane } = bodySchema.parse(request.body)

    await knex('lunchs')
      .update({
        name,
        description,
        // eslint-disable-next-line
          in_plane,
      })
      .where({ id })
  })

  app.delete('/:id', async (request) => {
    const schema = z.object({
      id: z.string().uuid(),
    })
    const { id } = schema.parse(request.params)

    await knex('lunchs').delete().where({
      id,
    })
  })
}
