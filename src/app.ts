import fastifyCookie from '@fastify/cookie'
import fastify from 'fastify'
import { usersRoutes } from './routes/users'
import { lunchsRoutes } from './routes/lunchs'

export const app = fastify()

app.register(fastifyCookie)

app.register(usersRoutes, {
  prefix: 'users',
})

app.register(lunchsRoutes, {
  prefix: 'lunchs',
})
