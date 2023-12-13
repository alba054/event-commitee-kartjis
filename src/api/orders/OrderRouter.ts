import { Router } from "express";
import { AuthorizationBearer } from "../../middleware/auth/AuthorizationBearer";
import { OrderHandler } from "./OrderHandler";

export class OrderRouter {
  private path: string;
  private router: Router;
  private handler: OrderHandler;

  constructor() {
    this.path = "/orders";
    this.router = Router();
    this.handler = new OrderHandler();
  }

  register() {
    // * commitee put order
    this.router
      .route(this.path + "/:id")
      .put(AuthorizationBearer.authorize(), this.handler.putOrder);

    return this.router;
  }
}
