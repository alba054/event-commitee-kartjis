import Joi from "joi";
import { BadRequestError } from "../exceptions/httpError/BadRequestError";
import { ERRORCODE } from "../utils";

export class Validator {
  validate(schema: Joi.ObjectSchema | Joi.ArraySchema, payload: any) {
    const validationResult = schema.validate(payload);

    if (validationResult.error) {
      throw new BadRequestError(
        ERRORCODE.VALIDATOR_ERROR,
        validationResult.error.message
      );
    }

    return null;
  }
}
