import { Joi, Segments } from 'celebrate';
import { TAGS } from '../constants/tags.js';
import isValidObjectId from 'mongoose';

// const isValidObjectId = (value, helpers) => {
//   if (!mongoose.isValidObjectId(value)) {
//     return helpers.error('any.invalid');
//   }
//   return value;
// };

const mongoIdValidator = (value, helpers) => {
  const isValidId = isValidObjectId(value);
  return isValidId ? value : helpers.message('Invalid id');
};

export const getAllNotesSchema = {
  [Segments.QUERY]: Joi.object({
    page: Joi.number().integer().min(1).required().default(1),
    perPage: Joi.number().integer().min(5).max(20).default(10),
    tag: Joi.string()
      .valid(...TAGS)
      .optional()
      .allow(''),
    search: Joi.string().optional().allow(''),
  }),
};

export const noteIdSchema = {
  [Segments.PARAMS]: Joi.object({
    noteId: Joi.string().custom(mongoIdValidator).required(),
  }),
};
