import {
  MessageAttributeValue,
  SendMessageBatchCommand,
  SendMessageBatchCommandInput,
  SendMessageBatchRequestEntry,
  SQSClient,
} from '@aws-sdk/client-sqs';
import { Room, User, UserContribution, UserDayStats } from '@lib/entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as dayjs from 'dayjs';
import { LessThan, Repository } from 'typeorm';

const lambdaVar = {
  user: 'aio39',
};

const REGION = 'ap-northeast-2';
const QUEUE_NAME = 'gitmoa_update_room_queue';
const QUERY_URL =
  'https://sqs.ap-northeast-2.amazonaws.com/324744157557/gitmoa_update_room_queue';

type roomMessageAttribute = {
  [key in 'roomId' | 'fromDate' | 'toDate']: MessageAttributeValue;
};
interface roomMessage extends SendMessageBatchRequestEntry {
  MessageAttributes: roomMessageAttribute;
}

const dateToMysqlFormatString = (date: Date = new Date()): string => {
  return dayjs(date).format('YYYY-MM-DD HH:mm:ss');
};

const splitArrayByNumber = <T>(array: T[], num: number) => {
  let i;
  const j = array.length;
  const result = [];
  for (i = 0; i < j; i += num) {
    result.push(array.slice(i, i + num));
  }
  return result;
};

@Injectable()
export class SlUserSyncService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    @InjectRepository(UserContribution)
    private readonly userContributions: Repository<UserContribution>,
    @InjectRepository(UserDayStats)
    private readonly userDayStats: Repository<UserDayStats>,
    @InjectRepository(Room)
    private readonly rooms: Repository<Room>,
  ) {}
  getHello(): Promise<User> {
    return this.users.findOne(12341234);
  }
  async roomSyncLoadToSQS() {
    const MAX_BATCH = 2;
    const FROM_BEFORE_HOUR = 36;
    const PASSING_MINUETS = 30;

    const dj = dayjs();
    const dj_hour = dj.get('hour') + (dj.get('minute') >= 30 ? 1 : 0);
    const execTimeISO = dj.set('hour', dj_hour).toISOString();
    const fromTimeISO = dj.subtract(FROM_BEFORE_HOUR, 'hour').toISOString();

    const rooms = await this.rooms.find({
      select: ['id'],
      where: { lastSyncedAt: LessThan(dayjs().subtract(30, 'minute')) },
    });

    const splitRooms = splitArrayByNumber(rooms, MAX_BATCH);

    const sqsClient = new SQSClient({ region: REGION });
    const results = await Promise.all(
      splitRooms.map((roomsChuck) => {
        const messageList: SendMessageBatchRequestEntry[] = roomsChuck.map(
          (room): roomMessage => ({
            Id: `${room.id}`,
            MessageBody: `${room.id} room sync`,
            MessageAttributes: {
              roomId: {
                DataType: 'String',
                StringValue: `${room.id}`,
              },
              fromDate: {
                DataType: 'String',
                StringValue: fromTimeISO,
              },
              toDate: {
                DataType: 'String',
                StringValue: execTimeISO,
              },
            },
          }),
        );
        const params: SendMessageBatchCommandInput = {
          QueueUrl: QUERY_URL,
          Entries: messageList,
        };

        return sqsClient.send(new SendMessageBatchCommand(params));
      }),
    );
    results.map((result) => {
      console.log(result);
    });
    return results;
  }
}
