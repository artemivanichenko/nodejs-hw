import { Joi, Segments } from 'celebrate';

export const createUserSchema = {
  [Segments.BODY]: Joi.object({
    // name: Joi.string().trim().min(2).max(50).messages({
    //   'string.empty': '{{#label}} cannot be empty',
    //   'any.required': '{{#label}} is required',
    // }),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(30).required(),
  }),
};

export const loginUserSchema = {
  [Segments.BODY]: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
};

export const requestResetEmailSchema = {
  [Segments.BODY]: Joi.object({
    email: Joi.string().email().required(),
  }),
};

export const requestResetPassSchema = {
  [Segments.BODY]: Joi.object({
    resetToken: Joi.string().required(),
    password: Joi.string().min(8).max(30).required(),
  }),
};
