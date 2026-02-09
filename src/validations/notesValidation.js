import { Joi, Segments } from 'celebrate';
import { TAGS } from '../constants/tags.js';
import mongoose from 'mongoose';

const mongoIdValidator = (value, helpers) => {
  const isValidId = mongoose.isValidObjectId(value);
  return isValidId ? value : helpers.message('Invalid ObjectId');
};

export const getAllNotesSchema = {
  [Segments.QUERY]: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    perPage: Joi.number().integer().min(5).max(20).default(10),
    tag: Joi.string()
      .valid(...TAGS)
      .optional(),
    search: Joi.string().optional().allow(''),
  }),
};

export const noteIdSchema = {
  [Segments.PARAMS]: Joi.object({
    noteId: Joi.string()
      .custom(mongoIdValidator, 'Invalid ObjectId')
      .required(),
  }),
};

export const createNoteSchema = {
  [Segments.BODY]: Joi.object({
    title: Joi.string().trim().min(1).required().messages({
      'string.empty': '{{#label}} cannot be empty',
      'any.required': '{{#label}} is required',
    }),
    content: Joi.string().allow('').optional(),
    tag: Joi.string()
      .valid(...TAGS)
      .optional(),
  }),
};

export const updateNoteSchema = {
  [Segments.PARAMS]: Joi.object({
    noteId: Joi.string()
      .custom(mongoIdValidator, 'Invalid ObjectId')
      .required(),
  }),
  [Segments.BODY]: Joi.object({
    title: Joi.string().min(1).messages({
      'string.empty': '{{#label}} cannot be empty',
    }),
    content: Joi.string().allow('').messages({
      'string.base': 'Content must be a string',
    }),
    tag: Joi.string().valid(...TAGS),
  })
    .min(1)
    .messages({
      'object.min':
        'The request body must contain at least one field to update.',
    }),
};
