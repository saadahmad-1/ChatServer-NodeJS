import Joi from 'joi';

export const createUserSchema = Joi.object({
  firstName: Joi.string().min(3).max(30).required(),
  lastName: Joi.string().min(3).max(30).required(),
  phoneNumber: Joi.string().required(),
});