import Joi from "joi";

export function validatorWrapper<T>(schema: Joi.Schema, data: any): T {
  const { value, error } = schema.validate(data, {
    abortEarly: false,
    allowUnknown: false,
    stripUnknown: true,
    convert: true,
  });

  if (error) {
    const errorMessage = error.details.map((d) => d.message).join(", ");
    throw new Error(errorMessage);
  }

  return value;
}
