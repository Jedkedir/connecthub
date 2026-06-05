import Joi from "joi"

const content = Joi.string().trim().min(1).max(1000).required().messages({
  "string.empty": "Comment content is required",
  "string.min": "Comment content is required",
  "string.max": "Comment must be at most 1000 characters",
})

const mentions = Joi.array()
  .items(Joi.string().trim().max(100))
  .max(10)
  .default([])
const mentionedUsers = Joi.array()
  .items(Joi.string().hex().length(24))
  .max(10)
  .default([])

const parentCommentId = Joi.string().hex().length(24).required().messages({
  "string.empty": "Parent comment is required",
  "string.length": "Parent comment is invalid",
  "string.hex": "Parent comment is invalid",
})

export const commentSchema = Joi.object({
  content,
  mentions,
  mentionedUsers,
})

export const replySchema = Joi.object({
  parentCommentId,
  content,
  mentions,
  mentionedUsers,
})
