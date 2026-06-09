import vine from '@vinejs/vine'

export const taskStatuses = ['todo', 'in_progress', 'blocked', 'done'] as const
export const taskPriorities = ['low', 'medium', 'high'] as const
export type TaskStatus = (typeof taskStatuses)[number]
export type TaskPriority = (typeof taskPriorities)[number]

const isoDatePattern = /^\d{4}-\d{2}-\d{2}$/

export const createTaskValidator = vine.create({
  title: vine.string().trim().minLength(1).maxLength(200),
  description: vine.string().trim().maxLength(5000).nullable().optional(),
  status: vine.enum(taskStatuses),
  priority: vine.enum(taskPriorities).nullable().optional(),
  dueDate: vine.string().trim().regex(isoDatePattern).nullable().optional(),
})

export const updateTaskValidator = vine.create({
  title: vine.string().trim().minLength(1).maxLength(200),
  description: vine.string().trim().maxLength(5000).nullable().optional(),
  status: vine.enum(taskStatuses),
  priority: vine.enum(taskPriorities).nullable().optional(),
  dueDate: vine.string().trim().regex(isoDatePattern).nullable().optional(),
})
