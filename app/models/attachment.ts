import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Project from '#models/project'
import Task from '#models/task'
import User from '#models/user'

export default class Attachment extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare projectId: number

  @column()
  declare taskId: number | null

  @column()
  declare userId: number

  @column()
  declare fileName: string

  @column()
  declare originalName: string

  @column()
  declare mimeType: string

  @column()
  declare fileSize: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @belongsTo(() => Project)
  declare project: BelongsTo<typeof Project>

  @belongsTo(() => Task)
  declare task: BelongsTo<typeof Task>

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>
}
