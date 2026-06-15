import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'notifications'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('user_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
      table
        .integer('project_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('projects')
        .onDelete('CASCADE')
      table
        .integer('task_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('tasks')
        .onDelete('SET NULL')
      table
        .integer('actor_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('users')
        .onDelete('SET NULL')
      table.string('type', 50).notNullable()
      table.string('title', 255).notNullable()
      table.text('body').nullable()
      table.json('metadata').nullable()
      table.timestamp('read_at').nullable()
      table.timestamp('created_at').notNullable()

      table.index(['user_id', 'created_at'])
      table.index(['user_id', 'read_at'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
