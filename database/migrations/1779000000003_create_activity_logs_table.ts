import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'activity_logs'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table
        .integer('project_id')
        .unsigned()
        .notNullable()
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
        .integer('comment_id')
        .unsigned()
        .nullable()
        .references('id')
        .inTable('comments')
        .onDelete('SET NULL')
      table
        .integer('actor_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('users')
        .onDelete('CASCADE')
      table.string('action', 50).notNullable()
      table.json('metadata').nullable()
      table.timestamp('created_at').notNullable()

      table.index(['project_id', 'created_at'])
      table.index(['actor_id', 'created_at'])
      table.index(['task_id', 'created_at'])
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
