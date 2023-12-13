import { NextFunction, Request, Response } from "express";
import { config } from "../../config/Config";
import { createResponse, RESPONSE_MESSAGE } from "../../utils";
import { Axio } from "../../utils/http/AxioRequest";
import { IBillDetailResponse } from "../../utils/interfaces/responses/Bill";

export class OrderHandler {
  constructor() {}

  async putOrder(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;

    try {
      const response = await Axio.put(
        `${config.config.TICKET_SERVICE_URL}/orders/${id}` ?? "",
        id
      );

      const bill: IBillDetailResponse = response?.data.data;

      return res
        .status(200)
        .json(createResponse(RESPONSE_MESSAGE.SUCCESS, bill));
    } catch (error) {
      return next(error);
    }
  }
}
