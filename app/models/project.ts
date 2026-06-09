import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import User from '#models/user'
import ProjectMember from '#models/project_member'
import Task from '#models/task'
import Comment from '#models/comment'
import ActivityLog from '#models/activity_log'
import Attachment from '#models/attachment'

export default class Project extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userId: number

  @column()
  declare name: string

  @column()
  declare description: string | null

  @column()
  declare status: 'active' | 'completed' | 'archived'

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @hasMany(() => Task)
  declare tasks: HasMany<typeof Task>

  @hasMany(() => ProjectMember)
  declare members: HasMany<typeof ProjectMember>

  @hasMany(() => Comment)
  declare comments: HasMany<typeof Comment>

  @hasMany(() => ActivityLog)
  declare activityLogs: HasMany<typeof ActivityLog>

  @hasMany(() => Attachment)
  declare attachments: HasMany<typeof Attachment>
}
