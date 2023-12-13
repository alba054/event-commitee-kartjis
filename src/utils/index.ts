import { Response } from "express";
import { ITokenPayload } from "./interfaces/TokenPayload";
import bcryptjs from "bcryptjs";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { BadRequestError } from "../exceptions/httpError/BadRequestError";
import { InternalServerError } from "../exceptions/httpError/InternalServerError";

export const createResponse = (
  status: string,
  data: any = null,
  error?: { code: string; message?: string } | undefined | null
) => {
  return { status, error, data };
};

export const ERRORCODE = {
  USER_NOT_FOUND_ERROR: "E404",
  MISSING_VALUE_HEADER_ERROR: "E408",
  INTERNAL_SERVER_ERROR_CODE: "E501",
  PASSWORD_INCORRECT_ERROR: "E414",
  PAYLOAD_NOT_FOUND: "E406",
  BAD_REQUEST_ERROR: "E400",
  VALIDATOR_ERROR: "E407",
  UNIQUE_CONSTRAINT_ERROR: "E401",
  LONG_VALUE_ERROR: "E403",
  INVALID_VALUE_ERROR: "E404",
  TOKEN_EXPIRED_ERROR: "E411",
  TOKEN_NOT_PROVIDED_ERROR: "E409",
  MALFORMED_TOKEN_ERROR: "E413",
  INVALID_TOKEN_ERROR: "E412",
};

export enum RESPONSE_MESSAGE {
  SUCCESS = "success",
  FAILED = "failed",
}

export const getTokenPayload = (res: Response): ITokenPayload => {
  return res.locals.user;
};

export const constants = {
  ACCESS_TOKEN_EXP: 24 * 60 * 60 * 30, // *  1 month
  REFRESH_TOKEN_EXP: 24 * 60 * 60 * 30, // * 1 month
  INVALID_TOKEN: "token is invalid",
  MALFORMED_TOKEN:
    "token is not formed correctly. JWT format is xxxx.yyyyy.zzzz",
  SIGNATURE_REQUIRED: "provide secret key to verify token",
  INVALID_SIGNATURE: "secret key is not valid",
  ABS_PATH: process.env.ABS_PATH,
  PASSWORD_SALT: 10,
  OFFSET_TIME: 8, // * GMT+8
};

export const hashPassword = (password: string) => {
  return bcryptjs.hashSync(password, 10);
};

export const catchPrismaError = (error: any) => {
  if (error instanceof PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      throw new BadRequestError(
        ERRORCODE.UNIQUE_CONSTRAINT_ERROR,
        "unique constraint failed on field" + error.meta?.target
      );
    } else if (error.code === "P2000") {
      throw new BadRequestError(
        ERRORCODE.LONG_VALUE_ERROR,
        "the value you provided too long for " + error.meta?.target
      );
    } else if (error.code === "P2003") {
      throw new BadRequestError(
        ERRORCODE.INVALID_VALUE_ERROR,
        "the value you provided failed to reference on " + error.meta?.target
      );
    } else if (error.code === "P2005") {
      throw new BadRequestError(
        ERRORCODE.INVALID_VALUE_ERROR,
        "the value you provided for field is invalid " + error.meta?.target
      );
    } else {
      throw new BadRequestError(ERRORCODE.BAD_REQUEST_ERROR, error.message);
    }
  } else {
    throw new InternalServerError(ERRORCODE.INTERNAL_SERVER_ERROR_CODE, error);
  }
};
