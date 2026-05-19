import vine from '@vinejs/vine'

const projectStatus = ['active', 'completed', 'archived'] as const

export const createProjectValidator = vine.create({
  name: vine.string().trim().minLength(1).maxLength(150),
  description: vine.string().trim().maxLength(5000).nullable().optional(),
})

export const updateProjectValidator = vine.create({
  name: vine.string().trim().minLength(1).maxLength(150),
  description: vine.string().trim().maxLength(5000).nullable().optional(),
  status: vine.enum(projectStatus),
})
