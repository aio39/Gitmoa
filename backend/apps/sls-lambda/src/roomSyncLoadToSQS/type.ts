import {
  MessageAttributeValue,
  SendMessageBatchRequestEntry,
} from '@aws-sdk/client-sqs';

export type roomSyncLoadToSQSEvent = {
  param: string;
};
export type roomSyncLoadToSQSResult = number[];

export type roomMessageAttribute = {
  [key in 'roomId' | 'fromDate' | 'toDate']?: MessageAttributeValue;
};

export interface roomMessage extends SendMessageBatchRequestEntry {
  MessageAttributes: roomMessageAttribute;
}
