import axios, { AxiosError } from "axios";
import { NextFunction, Request, Response } from "express";
import { config } from "../../config/Config";
import { BadRequestError } from "../../exceptions/httpError/BadRequestError";
import { NotFoundError } from "../../exceptions/httpError/NotFoundError";
import { UserService } from "../../services/UserService";
import {
  createResponse,
  ERRORCODE,
  getTokenPayload,
  RESPONSE_MESSAGE,
} from "../../utils";
import { Axio } from "../../utils/http/AxioRequest";
import { IEventDetailResponse } from "../../utils/interfaces/responses/Event";
import { IOrderDetailResponse } from "../../utils/interfaces/responses/Order";
import { IPutTicketPurchasementPayload } from "../../utils/interfaces/TicketPurchasement";
import { ITokenPayload } from "../../utils/interfaces/TokenPayload";
import { TicketPurchasementPayloadSchema } from "../../validator/tickets/TicketPurchasementSchema";
import { Validator } from "../../validator/Validator";

export class EventHandler {
  private userService: UserService;
  private validator: Validator;

  constructor() {
    this.userService = new UserService();
    this.validator = new Validator();

    this.getCommiteeEvent = this.getCommiteeEvent.bind(this);
    this.putTicketsPurchasement = this.putTicketsPurchasement.bind(this);
  }

  async putTicketsPurchasement(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const tokenPayload: ITokenPayload = getTokenPayload(res);
      const payload = req.body as IPutTicketPurchasementPayload;
      this.validator.validate(TicketPurchasementPayloadSchema, payload);

      const user = await this.userService.getUserByUsername(
        tokenPayload.username
      );

      const response = await Axio.put(
        `${config.config.TICKET_SERVICE_URL}/events/${user.eventId}/tickets` ??
          "",
        payload
      );

      const order: IOrderDetailResponse = response?.data.data;

      return res
        .status(200)
        .json(createResponse(RESPONSE_MESSAGE.SUCCESS, order));
    } catch (error) {
      return next(error);
    }
  }

  async getCommiteeEvent(req: Request, res: Response, next: NextFunction) {
    const tokenPayload: ITokenPayload = getTokenPayload(res);

    try {
      const user = await this.userService.getUserByUsername(
        tokenPayload.username
      );

      const response = await Axio.get(
        `${config.config.TICKET_SERVICE_URL}/events/${user.eventId}` ?? ""
      );

      const event: IEventDetailResponse = response?.data.data;

      return res
        .status(200)
        .json(createResponse(RESPONSE_MESSAGE.SUCCESS, event));
    } catch (error) {
      return next(error);
    }
  }
}
