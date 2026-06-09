import ActivityLog from '#models/activity_log'

export type ActivityAction =
  | 'project_created'
  | 'project_updated'
  | 'project_archived'
  | 'project_restored'
  | 'task_created'
  | 'task_updated'
  | 'task_deleted'
  | 'comment_created'

type ActivityMetadata = Record<string, unknown>

interface RecordActivityOptions {
  projectId: number
  actorId: number
  action: ActivityAction
  taskId?: number | null
  commentId?: number | null
  metadata?: ActivityMetadata | null
}

export function describeActivity(action: ActivityAction, metadata?: ActivityMetadata | null) {
  switch (action) {
    case 'project_created':
      return 'Created this project'
    case 'project_updated':
      return 'Updated the project details'
    case 'project_archived':
      return 'Archived this project'
    case 'project_restored':
      return 'Restored this project'
    case 'task_created':
      return metadata?.taskTitle ? `Created task "${metadata.taskTitle}"` : 'Created a task'
    case 'task_updated':
      return metadata?.taskTitle ? `Updated task "${metadata.taskTitle}"` : 'Updated a task'
    case 'task_deleted':
      return metadata?.taskTitle ? `Deleted task "${metadata.taskTitle}"` : 'Deleted a task'
    case 'comment_created':
      return 'Added a comment'
    default:
      return 'Updated the project'
  }
}

export async function recordActivity(options: RecordActivityOptions) {
  return ActivityLog.create({
    projectId: options.projectId,
    taskId: options.taskId ?? null,
    commentId: options.commentId ?? null,
    actorId: options.actorId,
    action: options.action,
    metadata: options.metadata ?? null,
  })
}
