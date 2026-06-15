import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from '#models/user'
import Project from '#models/project'
import Task from '#models/task'
import type { NotificationType } from '#services/notification'

export default class Notification extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userId: number

  @column()
  declare projectId: number | null

  @column()
  declare taskId: number | null

  @column()
  declare actorId: number | null

  @column()
  declare type: NotificationType

  @column()
  declare title: string

  @column()
  declare body: string | null

  @column()
  declare metadata: Record<string, unknown> | null

  @column.dateTime()
  declare readAt: DateTime | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  get isRead() {
    return this.readAt !== null
  }

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @belongsTo(() => Project)
  declare project: BelongsTo<typeof Project>

  @belongsTo(() => Task)
  declare task: BelongsTo<typeof Task>

  @belongsTo(() => User, { foreignKey: 'actorId' })
  declare actor: BelongsTo<typeof User>
}
