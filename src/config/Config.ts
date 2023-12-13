import { constants } from "../utils";
import dotenv from "dotenv";

dotenv.config();

interface IConfig {
  ACCESS_SECRET_KEY?: string;
  REFRESH_SECRET_KEY?: string;
  TOKEN_ISSUER?: string;
  ACCESS_TOKEN_CLAIMS?: {
    expiresIn: number;
    issuer?: string;
  };
  REFRESH_TOKEN_CLAIMS?: {
    expiresIn: number;
    issuer?: string;
  };
  PASSWORD_RESET_TOKEN_EXP?: number;
  TICKET_SERVICE_URL?: string;
}

class Config {
  private env: string;
  config: IConfig;

  constructor(env: string) {
    this.env = env;
    this.config = {};
  }

  loadConfig() {
    if (this.env === "PRODUCTION") {
      return {};
    } else {
      this.config.TOKEN_ISSUER = process.env.ISSUER;
      this.config.ACCESS_TOKEN_CLAIMS = {
        expiresIn: constants.ACCESS_TOKEN_EXP,
        issuer: process.env.ISSUER,
      };
      this.config.REFRESH_TOKEN_CLAIMS = {
        issuer: process.env.ISSUER,
        expiresIn: constants.REFRESH_TOKEN_EXP,
      };
      this.config.ACCESS_SECRET_KEY = process.env.ACCESS_SECRET_KEY;
      this.config.REFRESH_SECRET_KEY = process.env.REFRESH_SECRET_KEY;
      this.config.TICKET_SERVICE_URL = process.env.TICKET_SERVICE_URL;
    }
  }
}

export const config = new Config(process.env.NODE_ENV ?? "DEVELOPMENT");
config.loadConfig();
