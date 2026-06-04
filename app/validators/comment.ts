import vine from '@vinejs/vine'

export const createCommentValidator = vine.create({
  body: vine.string().trim().minLength(1).maxLength(5000),
})
