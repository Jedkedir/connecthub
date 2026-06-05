import Joi from "joi"

const fullName = Joi.string().trim().min(2).max(50).required().messages({
  "string.empty": "Full name is required",
  "string.min": "Full name must be at least 2 characters",
  "string.max": "Full name must be at most 50 characters",
})

const email = Joi.string().trim().email({ tlds: { allow: false } }).required().messages({
  "string.empty": "Email is required",
  "string.email": "Enter a valid email address",
})

const password = Joi.string().trim().min(8).max(128).required().messages({
  "string.empty": "Password is required",
  "string.min": "Password must be at least 8 characters",
  "string.max": "Password must be at most 128 characters",
})

export const loginSchema = Joi.object({
  email,
  password,
})

export const signupSchema = Joi.object({
  fullname: fullName,
  email,
  password,
})

export const changePasswordSchema = Joi.object({
  currentPassword: password.label("Current password"),
  newPassword: Joi.string()
    .trim()
    .min(8)
    .max(128)
    .invalid(Joi.ref("currentPassword"))
    .required()
    .messages({
      "string.empty": "New password is required",
      "string.min": "New password must be at least 8 characters",
      "string.max": "New password must be at most 128 characters",
      "any.invalid": "New password must be different from current password",
    }),
  confirmPassword: Joi.string().valid(Joi.ref("newPassword")).required().messages({
    "any.only": "Passwords do not match",
    "string.empty": "Please confirm your new password",
  }),
})

export const editProfileSchema = Joi.object({
  fullname: fullName,
  bio: Joi.string().trim().max(160).allow("").optional().messages({
    "string.max": "Bio must be at most 160 characters",
  }),
  profilePic: Joi.string().uri().allow("").optional().messages({
    "string.uri": "Profile picture must be a valid URL",
  }),
})
