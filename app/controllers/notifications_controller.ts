import type { HttpContext } from '@adonisjs/core/http'
import type Notification from '#models/notification'
import {
  markAsRead,
  markAllAsRead,
  unreadCount,
  getNotificationsForUser,
} from '#services/notification'

export default class NotificationsController {
  private serializeNotification(notification: Notification) {
    return {
      id: notification.id,
      userId: notification.userId,
      projectId: notification.projectId,
      taskId: notification.taskId,
      actorId: notification.actorId,
      type: notification.type,
      title: notification.title,
      body: notification.body,
      metadata: notification.metadata,
      readAt: notification.readAt?.toISO() ?? null,
      createdAt: notification.createdAt.toISO() ?? '',
      actor: notification.actor
        ? {
            id: notification.actor.id,
            fullName: notification.actor.fullName,
            email: notification.actor.email,
            initials: notification.actor.initials,
          }
        : null,
      project: notification.project
        ? {
            id: notification.project.id,
            name: notification.project.name,
          }
        : null,
    }
  }

  public async index({ inertia, auth }: HttpContext) {
    const notifications = await getNotificationsForUser(auth.user!.id)
    const count = await unreadCount(auth.user!.id)

    return inertia.render(
      'Notifications/Index' as never,
      {
        notifications: notifications.map((n) => this.serializeNotification(n)),
        unreadCount: count,
      } as never
    )
  }

  public async markAsRead({ params, response, auth }: HttpContext) {
    await markAsRead(params.id, auth.user!.id)

    if (response) {
      return response.redirect().back()
    }
  }

  public async markAllAsRead({ response, auth }: HttpContext) {
    await markAllAsRead(auth.user!.id)

    if (response) {
      return response.redirect().back()
    }
  }

  public async unreadCount({ auth }: HttpContext) {
    const count = await unreadCount(auth.user!.id)

    return { count }
  }

  public async recent({ auth }: HttpContext) {
    const notifications = await getNotificationsForUser(auth.user!.id, 5)
    const count = await unreadCount(auth.user!.id)

    return {
      notifications: notifications.map((n) => this.serializeNotification(n)),
      unreadCount: count,
    }
  }
}
