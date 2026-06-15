import { DateTime } from 'luxon'
import Notification from '#models/notification'
import Project from '#models/project'
import ProjectMember from '#models/project_member'

export type NotificationType =
  | 'project_invite'
  | 'task_created'
  | 'task_updated'
  | 'task_deleted'
  | 'comment_created'

interface CreateNotificationOptions {
  userId: number
  projectId?: number | null
  taskId?: number | null
  actorId?: number | null
  type: NotificationType
  title: string
  body?: string | null
  metadata?: Record<string, unknown> | null
}

export async function createNotification(options: CreateNotificationOptions) {
  return Notification.create({
    userId: options.userId,
    projectId: options.projectId ?? null,
    taskId: options.taskId ?? null,
    actorId: options.actorId ?? null,
    type: options.type,
    title: options.title,
    body: options.body ?? null,
    metadata: options.metadata ?? null,
  })
}

export async function notifyProjectMembers(
  projectId: number,
  excludingUserId: number,
  type: NotificationType,
  title: string,
  extra: Partial<CreateNotificationOptions> = {}
) {
  const project = await Project.findOrFail(projectId)
  const members = await ProjectMember.query().where('project_id', projectId)

  const userIds = new Set<number>()
  for (const member of members) {
    userIds.add(member.userId)
  }
  userIds.add(project.userId)
  userIds.delete(excludingUserId)

  for (const userId of userIds) {
    await createNotification({
      userId,
      projectId,
      type,
      title,
      actorId: excludingUserId,
      ...extra,
    })
  }
}

export async function markAsRead(notificationId: number, userId: number) {
  const notification = await Notification.query()
    .where('id', notificationId)
    .where('user_id', userId)
    .firstOrFail()

  notification.readAt = DateTime.now()
  await notification.save()

  return notification
}

export async function markAllAsRead(userId: number) {
  await Notification.query()
    .where('user_id', userId)
    .whereNull('read_at')
    .update({ readAt: DateTime.now() })
}

export async function unreadCount(userId: number) {
  const count = await Notification.query()
    .where('user_id', userId)
    .whereNull('read_at')
    .count('* as total')
    .firstOrFail()

  return Number(count.$extras.total)
}

export async function getNotificationsForUser(userId: number, limit = 20) {
  return Notification.query()
    .where('user_id', userId)
    .preload('actor')
    .preload('project', (query) => query.select('id', 'name'))
    .orderBy('created_at', 'desc')
    .limit(limit)
}
