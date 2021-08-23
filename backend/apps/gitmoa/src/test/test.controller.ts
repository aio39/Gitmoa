import {
  MessageAttributeValue,
  SendMessageBatchCommand,
  SendMessageBatchCommandInput,
  SendMessageBatchRequestEntry,
  SQSClient,
} from '@aws-sdk/client-sqs';
import { Room, User, UserContribution, UserDayStats } from '@lib/entity';
import { Controller, Get } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as dayjs from 'dayjs';
import { LessThan, Repository } from 'typeorm';
import { TestService } from './test.service';
const lambdaVar = {
  user: 'aio39',
};

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

const REGION = 'ap-northeast-2';
const QUEUE_NAME = 'gitmoa_update_room_queue';
const QUERY_URL =
  'https://sqs.ap-northeast-2.amazonaws.com/324744157557/gitmoa_update_room_queue';
@Controller('test')
export class TestController {
  constructor(
    private readonly testService: TestService,
    @InjectRepository(User) private readonly users: Repository<User>,
    @InjectRepository(UserContribution)
    private readonly userContributions: Repository<UserContribution>,
    @InjectRepository(UserDayStats)
    private readonly userDayStats: Repository<UserDayStats>,
    @InjectRepository(Room)
    private readonly rooms: Repository<Room>,
  ) {}

  @Get('rsls') // 특정 시간마다 방을 sqs에 올림.
  async roomSyncLoadToSQS() {
    const MAX_BATCH = 2;
    const FROM_BEFORE_HOUR = 36;
    const PASSING_MINUETS = 30;

    const dj = dayjs();
    const dj_hour = dj.get('hour') + (dj.get('minute') >= 30 ? 1 : 0);
    const execTimeISO = dj.set('hour', dj_hour).toISOString();
    const fromTimeISO = dj.subtract(FROM_BEFORE_HOUR, 'hour').toISOString();

    // const rooms = await this.rooms
    //   .createQueryBuilder('room')
    //   .select(['id'])
    //   .where('IFNULL(room.lastSyncedAt,0) < :time', {
    //     time: dayjs().subtract(30, 'minute').toISOString(),
    //   });
    const rooms = await this.rooms.find({
      select: ['id'],
      where: {
        lastSyncedAt: LessThan(dayjs().subtract(30, 'minute').toISOString()),
      },
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
  }
}
