import { Router } from "express";
import { AuthorizationBearer } from "../../middleware/auth/AuthorizationBearer";
import { EventHandler } from "./EventHandler";

export class EventRouter {
  private eventHandler: EventHandler;
  private path: string;
  private router: Router;

  constructor() {
    this.path = "/events";
    this.router = Router();
    this.eventHandler = new EventHandler();
  }

  register() {
    // * commitee only related to one event so that this endpoint will access individual event
    // * commitee purchase tickets
    this.router
      .route(this.path)
      .get(AuthorizationBearer.authorize(), this.eventHandler.getCommiteeEvent)
      .put(AuthorizationBearer.authorize(), this.eventHandler.putTicketsPurchasement);
    

    return this.router;
  }
}
