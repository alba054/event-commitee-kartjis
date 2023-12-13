import { config } from "../../config/Config";
import { BadRequestError } from "../../exceptions/httpError/BadRequestError";
import { InternalServerError } from "../../exceptions/httpError/InternalServerError";
import { NotFoundError } from "../../exceptions/httpError/NotFoundError";
import { ERRORCODE } from "../../utils";
import { tokenGenerator } from "../../utils/auth/TokenGenerator";
import { ITokenPayload } from "../../utils/interfaces/TokenPayload";

export class AuthenticationService {
  constructor() {}

  async generateToken(
    payload: ITokenPayload | { error: number; message: string }
  ) {
    if (!config.config.ACCESS_SECRET_KEY || !config.config.REFRESH_SECRET_KEY) {
      throw new InternalServerError(ERRORCODE.INTERNAL_SERVER_ERROR_CODE);
    }

    if ("error" in payload) {
      return payload;
    }

    let accessTokenClaims = { subject: payload.username };
    let refreshTokenClaims = { subject: payload.username };

    Object.assign(accessTokenClaims, config.config.ACCESS_TOKEN_CLAIMS);
    Object.assign(refreshTokenClaims, config.config.REFRESH_TOKEN_CLAIMS);

    const accessToken = await tokenGenerator.sign(
      payload,
      config.config.ACCESS_SECRET_KEY,
      "exp" in payload || "iss" in payload ? undefined : accessTokenClaims
    );

    const refreshToken = await tokenGenerator.sign(
      payload,
      config.config.REFRESH_SECRET_KEY,
      "exp" in payload || "iss" in payload ? undefined : refreshTokenClaims
    );

    return { accessToken, refreshToken };
  }

  async verifyToken(token: string, secretKey: string) {
    try {
      const decoded = await tokenGenerator.verify(token, secretKey, {
        issuer: config.config.TOKEN_ISSUER,
      });

      if (!decoded) {
        throw new NotFoundError(
          ERRORCODE.PAYLOAD_NOT_FOUND,
          "payload's not found"
        );
      }

      return decoded;
    } catch (error: any) {
      throw new BadRequestError(ERRORCODE.BAD_REQUEST_ERROR, error);
    }
  }
}
