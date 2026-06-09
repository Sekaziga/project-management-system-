import vine from '@vinejs/vine'

export const projectMemberRoles = ['admin', 'member', 'viewer'] as const
export type ProjectMemberRole = (typeof projectMemberRoles)[number]

export const inviteProjectMemberValidator = vine.create({
  email: vine.string().trim().email(),
  role: vine.enum(projectMemberRoles),
})

export const updateProjectMemberValidator = vine.create({
  role: vine.enum(projectMemberRoles),
})
