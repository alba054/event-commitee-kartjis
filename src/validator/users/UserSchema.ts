import Joi from "joi";

export const UserPostPayloadSchema = Joi.array().items(
  Joi.object({
    name: Joi.string().optional(),
    username: Joi.string().required().max(50),
    email: Joi.string().optional().email(),
    phoneNumber: Joi.string().optional().max(20),
    password: Joi.string().required(),
    eventId: Joi.string().optional().max(100),
  })
);
