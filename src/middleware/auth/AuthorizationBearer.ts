import { NextFunction, Request, Response } from "express";
import { TokenExpiredError, JsonWebTokenError } from "jsonwebtoken";
import { BadRequestError } from "../../exceptions/httpError/BadRequestError";
import { InternalServerError } from "../../exceptions/httpError/InternalServerError";
import { tokenGenerator } from "../../utils/auth/TokenGenerator";
import { config } from "../../config/Config";
import { UnauthorizedError } from "../../exceptions/httpError/UnauthorizedError";
import { ERRORCODE, constants } from "../../utils";
import { UnauthenticatedError } from "../../exceptions/httpError/UnauthenticatedError";
import { UserService } from "../../services/UserService";

export class AuthorizationBearer {
  static authorize() {
    return async function authorizationHandler(
      req: Request,
      res: Response,
      next: NextFunction
    ) {
      const { authorization } = req.headers;
      const bearerSchema = authorization?.split(" ");
      try {
        if (!bearerSchema) {
          // todo: handler for authorization is not provided
          throw new BadRequestError(
            ERRORCODE.MISSING_VALUE_HEADER_ERROR,
            "Provide Authorization in header"
          );
        }

        if (bearerSchema[0] !== "Bearer") {
          // todo: handler for invalid schema (without Basic Prefix)
          throw new BadRequestError(
            ERRORCODE.MISSING_VALUE_HEADER_ERROR,
            'Invalid schema. provide "Bearer <token>"'
          );
        }

        if (!bearerSchema[1]) {
          // todo: handler for authorization credential is not provided
          throw new BadRequestError(
            ERRORCODE.MISSING_VALUE_HEADER_ERROR,
            "provide token"
          );
        }

        const token = bearerSchema[1];

        if (!config.config.ACCESS_SECRET_KEY) {
          throw new InternalServerError(ERRORCODE.INTERNAL_SERVER_ERROR_CODE);
        }

        const tokenPayload = await tokenGenerator.verify(
          token,
          config.config.ACCESS_SECRET_KEY,
          {
            issuer: config.config.TOKEN_ISSUER,
          }
        );

        if (!tokenPayload) {
          throw new UnauthorizedError(
            ERRORCODE.TOKEN_NOT_PROVIDED_ERROR,
            "provide token"
          );
        }

        const userService = new UserService();
        await userService.getUserByUsername(tokenPayload.username);

        res.locals.user = tokenPayload;

        next();
      } catch (error: any) {
        if (error instanceof TokenExpiredError) {
          return next(
            new UnauthenticatedError(
              ERRORCODE.TOKEN_EXPIRED_ERROR,
              error.message
            )
          );
        } else if (error instanceof JsonWebTokenError) {
          if (error.message === "invalid token") {
            // todo: BadRequestError with custom invalid token message
            return next(
              new BadRequestError(
                ERRORCODE.INVALID_TOKEN_ERROR,
                constants.INVALID_TOKEN
              )
            );
          } else if (error.message === "jwt malformed") {
            // todo: BadRequestError with custom token malformed message
            return next(
              new BadRequestError(
                ERRORCODE.MALFORMED_TOKEN_ERROR,
                constants.MALFORMED_TOKEN
              )
            );
          } else if (error.message === "jwt signature is required") {
            // todo: BadRequestError with custom required signature message
            return next(
              new BadRequestError(
                ERRORCODE.INVALID_TOKEN_ERROR,
                constants.SIGNATURE_REQUIRED
              )
            );
          } else if (error.message === "invalid signature") {
            // todo: BadRequestError with custom invalid signature message
            return next(
              new BadRequestError(
                ERRORCODE.INVALID_TOKEN_ERROR,
                constants.INVALID_SIGNATURE
              )
            );
          } else {
            return next(
              new BadRequestError(ERRORCODE.BAD_REQUEST_ERROR, error.message)
            );
          }
        } else {
          return next(error);
        }
      }
    };
  }
}
