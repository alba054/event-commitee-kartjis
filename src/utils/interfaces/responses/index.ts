import { IBaseResponse } from "./Base";

export const convertBaseResponseToDTO = (status: string, responseType: any) => {
  return {
    status,
    data: responseType,
  } as IBaseResponse;
};
