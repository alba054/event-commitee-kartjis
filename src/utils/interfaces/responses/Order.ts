export interface IOrderDetailResponse {
  readonly id: string;
  readonly status: string;
  readonly createdAt: string | Date;
  readonly updatedAt: string | Date;
  readonly customerId: string;
  readonly billId: string;
  readonly billToken: string;
  readonly billLink: string;
  readonly paymentId: string;
  readonly eventId: string;
}
