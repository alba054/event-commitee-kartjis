import axios, { AxiosError } from "axios";
import { ERRORCODE } from "..";
import { BadRequestError } from "../../exceptions/httpError/BadRequestError";
import { NotFoundError } from "../../exceptions/httpError/NotFoundError";

class AxioRequest {
  async get(url: string) {
    try {
      const response = await axios.get(url);

      return response;
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 404) {
          throw new NotFoundError(
            ERRORCODE.PAYLOAD_NOT_FOUND,
            error.response?.data.data
          );
        } else if (error.response?.status === 400) {
          throw new BadRequestError(
            ERRORCODE.BAD_REQUEST_ERROR,
            error.response?.data.data
          );
        }
      }
    }
  }

  async put(url: string, data: any) {
    try {
      const response = await axios.put(url, data);

      return response;
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 404) {
          throw new NotFoundError(
            ERRORCODE.PAYLOAD_NOT_FOUND,
            error.response?.data.data
          );
        } else if (error.response?.status === 400) {
          throw new BadRequestError(
            ERRORCODE.BAD_REQUEST_ERROR,
            error.response?.data.data
          );
        }
      }
    }
  }
}

export const Axio = new AxioRequest();
