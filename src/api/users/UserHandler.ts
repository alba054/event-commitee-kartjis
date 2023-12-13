import { NextFunction, Request, Response } from "express";
import { AuthenticationService } from "../../services/facade/AuthenticationService";
import { UserService } from "../../services/UserService";
import { createResponse, getTokenPayload, RESPONSE_MESSAGE } from "../../utils";
import { IUserProfileDTO } from "../../utils/dto/UserDTO";
import { ITokenPayload } from "../../utils/interfaces/TokenPayload";
import { IPostUsers } from "../../utils/interfaces/User";
import { UserPostPayloadSchema } from "../../validator/users/UserSchema";
import { Validator } from "../../validator/Validator";

export class UserHandler {
  private authenticationService: AuthenticationService;
  private validator: Validator;
  private userService: UserService;

  constructor() {
    this.authenticationService = new AuthenticationService();
    this.userService = new UserService();
    this.validator = new Validator();

    this.postUserLogin = this.postUserLogin.bind(this);
    this.postManyUsers = this.postManyUsers.bind(this);
    this.getUserProfile = this.getUserProfile.bind(this);
  }

  async getUserProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const tokenPayload: ITokenPayload = getTokenPayload(res);
      const user = await this.userService.getUserByUsername(
        tokenPayload.username
      );

      return res.status(200).json(
        createResponse(RESPONSE_MESSAGE.SUCCESS, {
          id: user.id,
          username: user.username,
          email: user.email,
          eventId: user.eventId,
          name: user.name,
          phoneNumber: user.phoneNumber,
        } as IUserProfileDTO)
      );
    } catch (error) {
      return next(error);
    }
  }

  async postManyUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const payload: IPostUsers[] = req.body;

      this.validator.validate(UserPostPayloadSchema, payload);

      await this.userService.addNewUsers(payload);

      return res
        .status(201)
        .json(
          createResponse(
            RESPONSE_MESSAGE.SUCCESS,
            "successfully register a new user"
          )
        );
    } catch (error) {
      return next(error);
    }
  }

  async postUserLogin(req: Request, res: Response, next: NextFunction) {
    try {
      const token = await this.authenticationService.generateToken(
        getTokenPayload(res)
      );

      return res
        .status(200)
        .json(createResponse(RESPONSE_MESSAGE.SUCCESS, token));
    } catch (error) {
      return next(error);
    }
  }
}
