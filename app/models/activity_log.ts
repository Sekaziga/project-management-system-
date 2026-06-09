import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Project from '#models/project'
import Task from '#models/task'
import Comment from '#models/comment'
import User from '#models/user'
import type { ActivityAction } from '#services/activity_log'

export default class ActivityLog extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare projectId: number

  @column()
  declare taskId: number | null

  @column()
  declare commentId: number | null

  @column()
  declare actorId: number

  @column()
  declare action: ActivityAction

  @column()
  declare metadata: Record<string, unknown> | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @belongsTo(() => Project)
  declare project: BelongsTo<typeof Project>

  @belongsTo(() => Task)
  declare task: BelongsTo<typeof Task>

  @belongsTo(() => Comment)
  declare comment: BelongsTo<typeof Comment>

  @belongsTo(() => User, { foreignKey: 'actorId' })
  declare user: BelongsTo<typeof User>
}
