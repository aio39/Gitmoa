export type roomSyncEvent = {
  fromDate?: string;
  toDate?: string;
  roomId: number;
  ReceiptHandle?: string;
};
export type roomSyncResult = number[];
