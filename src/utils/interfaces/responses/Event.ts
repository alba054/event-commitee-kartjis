import { ITicketDetailResponse } from "./Ticket";

export interface IEventDetailResponse {
  readonly id: string;
  readonly location: string;
  readonly name: string;
  readonly thumbnailURI: string;
  readonly description: string;
  readonly tickets: ITicketDetailResponse[];
  readonly schedules: { startTime: number; endTime: number; quota: number }[];
}
