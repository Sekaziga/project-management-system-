import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Project from '#models/project'
import Comment from '#models/comment'
import ActivityLog from '#models/activity_log'

export default class Task extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare projectId: number

  @column()
  declare title: string

  @column()
  declare description: string | null

  @column()
  declare status: 'todo' | 'in_progress' | 'blocked' | 'done'

  @column()
  declare priority: 'low' | 'medium' | 'high' | null

  @column.date()
  declare dueDate: DateTime | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => Project)
  declare project: BelongsTo<typeof Project>

  @hasMany(() => Comment)
  declare comments: HasMany<typeof Comment>

  @hasMany(() => ActivityLog)
  declare activityLogs: HasMany<typeof ActivityLog>
}
