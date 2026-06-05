import Joi from "joi"

const content = Joi.string().trim().min(1).max(500).required().messages({
  "string.empty": "Post content is required",
  "string.min": "Post content is required",
  "string.max": "Post content must be at most 500 characters",
})

const mentions = Joi.array()
  .items(Joi.string().trim().max(100))
  .max(10)
  .default([])
const topics = Joi.array()
  .items(Joi.string().trim().max(100))
  .max(10)
  .default([])
const mentionedUsers = Joi.array()
  .items(Joi.string().hex().length(24))
  .max(10)
  .default([])

export const createPostSchema = Joi.object({
  content,
  mentions,
  mentionedUsers,
  topics,
})
