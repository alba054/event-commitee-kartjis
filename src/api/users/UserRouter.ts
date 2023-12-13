import { Router } from "express";
import { AuthorizationBearer } from "../../middleware/auth/AuthorizationBearer";
import { BasicAuthMiddleware } from "../../middleware/auth/BasicAuth";
import { UserHandler } from "./UserHandler";

export class UserRouter {
  private userHandler: UserHandler;
  private path: string;
  private router: Router;

  constructor() {
    this.path = "/users";
    this.router = Router();
    this.userHandler = new UserHandler();
  }

  register() {
    // * login
    this.router.post(
      this.path + "/login",
      BasicAuthMiddleware.authenticate(),
      this.userHandler.postUserLogin
    );
    // * post user batch
    this.router
      .route(this.path)
      .post(this.userHandler.postManyUsers)
      .get(AuthorizationBearer.authorize(), this.userHandler.getUserProfile);

    return this.router;
  }
}
