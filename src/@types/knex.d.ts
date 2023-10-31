// eslint-disable-next-line
import { Knex } from 'knex'

declare module 'knex/types/tables' {
  export interface Tables {
    users: {
      id: string
      name: string
      username: string
      password: string
      created_at: string
      session_id?: string
    }
    lunchs: {
      id: string
      name: string
      description: string
      created_at: string
      in_plane: boolean
      session_id?: string
    }
  }
}
