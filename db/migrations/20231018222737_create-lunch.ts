import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('lunchs', (table) => {
    table.uuid('id').primary()
    table.uuid('session_id').notNullable()
    table.text('name').notNullable()
    table.text('description').notNullable()
    table.boolean('in_plane').notNullable()
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable()
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('lunchs')
}
