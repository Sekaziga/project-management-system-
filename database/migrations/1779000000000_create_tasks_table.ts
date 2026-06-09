import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'tasks'

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
      table.string('title', 200).notNullable()
      table.text('description').nullable()
      table
        .enum('status', ['todo', 'in_progress', 'blocked', 'done'])
        .notNullable()
        .defaultTo('todo')
      table.enum('priority', ['low', 'medium', 'high']).nullable()
      table.date('due_date').nullable()
      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
