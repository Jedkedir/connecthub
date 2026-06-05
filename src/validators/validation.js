export const getValidationMessage = (error) =>
  error?.details?.map((detail) => detail.message).join(", ") || ""

export const validateSchema = (schema, data) => {
  const { error, value } = schema.validate(data, {
    abortEarly: false,
    stripUnknown: true,
  })

  return {
    error: getValidationMessage(error),
    value,
  }
}
