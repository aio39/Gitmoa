import {
  DeleteMessageCommand,
  DeleteMessageCommandInput,
  ReceiveMessageCommand,
  SendMessageBatchCommand,
  SendMessageBatchCommandInput,
  SendMessageBatchRequestEntry,
  SQSClient,
} from '@aws-sdk/client-sqs';
import {
  ContributionType,
  Room,
  RoomDayStats,
  User,
  UserContribution,
  UserDayStats,
} from '@lib/entity';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { roomSyncEvent } from 'apps/sls-lambda/src/roomSync/type';
import sls_fn_names from 'apps/sls-lambda/src/sls_const';
import { userSyncEvent } from 'apps/sls-lambda/src/userSync/type';
import { Lambda } from 'aws-sdk';
import * as dayjs from 'dayjs';
import { GraphQLClient } from 'graphql-request';
import * as redis from 'redis';
import { Repository } from 'typeorm';
import { promisify } from 'util';
import { getSdk, SdkFunctionWrapper } from './gql_codegen/gh_gql_type';
import { roomMessage, roomMessageAttribute } from './roomSyncLoadToSQS/type';
import {
  dateToMysqlFormatString,
  genRedisUserSyncKey,
  rmUndefinedFields,
  splitArrayByNumber,
} from './utils';

const lambdaVar = {
  user: 'aio39',
};

const REGION = process.env.REGION;
const QUEUE_NAME = 'gitmoa_update_room_queue';
const ROOM_QUERY_URL =
  'https://sqs.ap-northeast-2.amazonaws.com/324744157557/gitmoa_update_room_queue';

@Injectable()
export class LambdaService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    @InjectRepository(UserContribution)
    private readonly userContributions: Repository<UserContribution>,
    @InjectRepository(UserDayStats)
    private readonly userDayStats: Repository<UserDayStats>,
    @InjectRepository(Room)
    private readonly rooms: Repository<Room>,
  ) {}

  private readonly logger = new Logger('gitmoa-lambda', { timestamp: true });
  private readonly sqsClient = new SQSClient({ region: REGION });

  getHello(): Promise<User> {
    return this.users.findOne(12341234);
  }
  // 전체 방과 유저의 정보를 최신화 하는 함수, 하루에 4번 실행
  async roomSyncLoadToSQS() {
    const MAX_BATCH = 2;
    const FROM_BEFORE_HOUR = 36;
    const PASSING_MINUETS = 30;
    const dj = dayjs();
    const roundedHour = dj.get('hour') + (dj.get('minute') >= 30 ? 1 : 0);

    const execTimeISO = dj.set('hour', roundedHour).toISOString();
    const fromTimeISO = dj.subtract(FROM_BEFORE_HOUR, 'hour').toISOString();
    const before30mFromNowISO = dayjs().subtract(30, 'minute').toISOString();

    const rooms = await this.rooms
      .createQueryBuilder('r')
      .where('IFNULL(r.lastSyncedAt,0) < :time', { time: before30mFromNowISO })
      .getMany();

    const splitRooms = splitArrayByNumber(rooms, MAX_BATCH);

    const sqsLoadRequests = await Promise.all(
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
          QueueUrl: ROOM_QUERY_URL,
          Entries: messageList,
        };

        return this.sqsClient.send(new SendMessageBatchCommand(params));
      }),
    );
    const resultHttpStatus = sqsLoadRequests.map((result) => {
      this.logger.debug(`${result?.Failed?.[0].SenderFault} `);
      this.logger.debug(`${result?.Successful?.[0].MessageId} `);
      return result.$metadata.httpStatusCode;
    });

    return resultHttpStatus;
  }

  // 5분 마다 sqs에 업데이트 해야할 방 있는 지 확인해서, 룸 싱크 함수를 실행
  async roomSyncConsumer(): Promise<any> {
    const MAX_BATCH = 10;
    const params = {
      AttributeNames: ['SentTimestamp'],
      MaxNumberOfMessages: MAX_BATCH,
      MessageAttributeNames: ['All'],
      QueueUrl: ROOM_QUERY_URL,
      VisibilityTimeout: 300,
      WaitTimeSeconds: 0,
    };
    const pulledMSG = await this.sqsClient.send(
      new ReceiveMessageCommand(params),
    );

    // sls offline --stage slocal 일 경우 end point 변경
    const lambda = new Lambda({
      ...(process.env.NODE_ENV === 'dev'
        ? {
            endpoint: 'http://localhost:3002',
          }
        : {}),
    });

    let result;

    if (pulledMSG.$metadata.httpStatusCode === 200 && pulledMSG.Messages) {
      pulledMSG.Messages.forEach((payload) => {
        const {
          roomId: { StringValue: roomId },
          fromDate: { StringValue: fromDate },
          toDate: { StringValue: toDate },
        } = payload.MessageAttributes as roomMessageAttribute; // TODO undefined 오류 안 나나?

        const roomSyncPayload: roomSyncEvent = rmUndefinedFields({
          roomId: parseInt(roomId),
          fromDate,
          toDate,
          ReceiptHandle: payload.ReceiptHandle,
        });

        lambda
          .invoke({
            FunctionName: sls_fn_names.ROOM_SYNC,
            InvocationType: 'RequestResponse ',
            Payload: JSON.stringify(roomSyncPayload),
          })
          .promise()
          .catch((err) => {
            console.log(err);
          });
      });
    }

    return result;
  }

  async roomSync({
    fromDate = '2021-01-01',
    toDate = '2021-06-30',
    roomId = 9,
    ReceiptHandle,
  }: roomSyncEvent) {
    const redisClient = redis.createClient({
      host: process.env.REDIS_HOST,
      port: +process.env.REDIS_PORT,
      password: process.env.REDIS_PASSWORD,
    });

    const lambda = new Lambda({
      ...(process.env.NODE_ENV === 'dev'
        ? {
            endpoint: 'http://localhost:3002',
          }
        : {}),
    });

    // const fromDate = '2021-04-01T15:00:00Z';
    // const toDate = '2021-06-30T15:00:00Z';

    // 방에 포함된 모든 유저 데이터를 가져오고 ,
    const foundRoom = await this.rooms.findOne(roomId, {
      relations: ['participants'], //'participants.userDayStats'
    });

    // 최근 1시간내에 업데이트 된 유저인지 구별한다.
    const updatedUserList: User[] = []; // A리스트 - 동기화 요청 안 해도 됨.
    const notUpdatedUserList: User[] = []; // B 리스트 - 추가 동기화가 필요함.
    foundRoom.participants.forEach((user) => {
      const isUpdatedInLast1H = dayjs(user.lastSyncedAt).isAfter(
        dayjs().subtract(1, 'day'),
      );
      isUpdatedInLast1H
        ? updatedUserList.push(user)
        : notUpdatedUserList.push(user);
    });

    // redis를 체크해서 이미 동기화 요청이 들어왔는지 확인
    type UserId = User['id'];
    const nowInRedisList: UserId[] = []; // B1 리스트 - 다른 roomSync에서 이미 요청 중이므로 기달림.
    const nowNotInRedisList: UserId[] = []; // B2 리스트 -- 지금 바로 userSync 요청

    await Promise.all(
      notUpdatedUserList.map(async (user): Promise<void> => {
        const isExists = await promisify(redisClient.exists).bind(redisClient)(
          'us' + user.id,
        );
        isExists
          ? nowInRedisList.push(user.id)
          : nowNotInRedisList.push(user.id);
      }),
    );

    // B2 리스트 user sync
    await Promise.all(
      nowNotInRedisList.map((userId) => {
        redisClient.set(genRedisUserSyncKey(userId), ''); // userSync가 시작되기 전에 redis에 올리기

        return lambda
          .invoke({
            FunctionName: sls_fn_names.USER_SYNC,
            InvocationType: 'RequestResponse ',
            Payload: JSON.stringify({ userId, fromDate, toDate }),
          })
          .promise();
        // TODO undefined 핸들링
      }),
    );

    //  B2가 끝나고 나서, Redis를 다시 체크해서 아직 안 끝났다면 직접 UserSync .
    const finishedRedisList: UserId[] = [];
    const maybeFailedList: UserId[] = [];

    await Promise.all(
      nowInRedisList.map(async (userId) => {
        const isExist = await redisClient.exists(genRedisUserSyncKey(userId));
        if (isExist) {
          // 아직도 안 끝날걸 보아 다른 sync 에서 에러가 생긴거 같으니 직접 sync 요청
          maybeFailedList.push(userId);
        } else {
          // 다른 곳에서 신청한 sync가 끝났으니 db에서 가져온다청
          finishedRedisList.push(userId);
        }
        return;
      }),
    );

    await Promise.all(
      maybeFailedList.map((userId) => {
        return lambda
          .invoke({
            FunctionName: sls_fn_names.USER_SYNC,
            InvocationType: 'RequestResponse ',
            Payload: JSON.stringify({ userId, fromDate, toDate }),
          })
          .promise();
        // return this.userSync({ userId, fromDate, toDate });
      }),
    );

    const userList = foundRoom.participants.map((user) => user.id);

    type DayStatus = Pick<
      RoomDayStats,
      'date' | 'total' | 'commit' | 'issue' | 'pullRequest' | 'isAllCommit'
    >;
    const dayStatsResult: DayStatus[] = await this.userDayStats
      .createQueryBuilder('stats')
      .select([
        'stats.date as date',
        'sum(stats.total) as total',
        'sum(stats.commit) as commit',
        'sum(stats.pullRequest) as pullRequest',
        'sum(stats.issue) as issue',
      ])
      .where('stats.fk_user_id in :user_list', { user_list: userList })
      .where('stats.date BETWEEN :from AND :to  ', {
        from: fromDate,
        to: toDate,
      }) // NOTE 여기서 에러 ?
      .groupBy('date')
      .getRawMany();

    const roomDayStatsInstance = dayStatsResult.map((day, idx) => {
      // TODO 으어어 이거 나중에 사람 늘어나는거 어떻게 처리?
      // 방 가입일 컬럼을 만들어줘서 filter해주고 ...
      const roomDayStats = new RoomDayStats();
      roomDayStats.isAllCommit = day.total === foundRoom.participants.length;
      roomDayStats.date_room_id = day.date + '-' + foundRoom.id;
      Object.assign(roomDayStats, day);
      return roomDayStats;
    });

    foundRoom.RoomDayStats = roomDayStatsInstance;
    // try {
    //   const result = await this.rooms.update(foundRoom.id, {
    //     RoomDayStats: roomDayStatsInstance,
    //   });
    // } catch (error) {
    //   console.log(error);
    // }
    const result2 = await this.rooms.save(foundRoom).catch((err) => {
      console.log('room save error', err);
    });

    console.log(result2);
    // await this.rooms.findOne(roomId, {
    //   relations: ['participants'],
    //   where: { 'participants.id': In(maybeFailedList) },
    // });

    const deleteParams: DeleteMessageCommandInput = {
      QueueUrl: ROOM_QUERY_URL,
      ReceiptHandle: ReceiptHandle,
    };

    this.sqsClient.send(new DeleteMessageCommand(deleteParams));
  }

  async userSync({
    fromDate = '2021-04-01T15:00:00Z',
    toDate = '2021-06-30T15:00:00Z',
    userId = 68348070,
  }: userSyncEvent) {
    const accessToken = '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';
    const endpoint = 'https://api.github.com/graphql';

    const first = 10;

    // const redisClient = redis.createClient({
    //   host: process.env.REDIS_HOST,
    //   port: +process.env.REDIS_PORT,
    //   password: process.env.REDIS_PASSWORD,
    // });

    // redisClient.get(`us${userId}`, (err, reply) => {
    //   console.log(reply);
    // });

    const foundUser = await this.users.findOne(userId);
    const variables = {
      login: foundUser.username,
      fromDate,
      sinceDate: fromDate,
      toDate,
      untilDate: toDate,
      first,
    };

    const graphQLClient = new GraphQLClient(endpoint, {
      headers: {
        authorization: `Bearer ${foundUser.accessToken}`,
      },
    });

    const clientTimingWrapper: SdkFunctionWrapper = async <T>(
      action: () => Promise<T>,
    ): Promise<T> => {
      const startTime = Date.now();
      const result = await action();
      console.log(`request duration (ms)`, Date.now() - startTime);
      return result;
    };

    const sdk = getSdk(graphQLClient, clientTimingWrapper);
    const data = await sdk.userInfo(variables);
    console.log(data);

    const {
      commitContributionsByRepository,
      pullRequestContributions,
      issueContributions,
    } = data.user.contributionsCollection;

    let [remainIssueTotal, remainPRTotal] = [
      issueContributions.totalCount - first,
      pullRequestContributions.totalCount - first,
    ];

    let issueCursor =
      issueContributions.edges[issueContributions.edges.length - 1]?.cursor;
    let prCursor =
      pullRequestContributions.edges[pullRequestContributions.edges.length - 1]
        ?.cursor;

    while (remainIssueTotal > 0 || remainPRTotal > 0) {
      const data = await sdk.cursorQuery({
        ...variables,
        issueCursor,
        prCursor,
      });

      const {
        pullRequestContributions: nextPR,
        issueContributions: nextIssue,
      } = data.user.contributionsCollection;

      pullRequestContributions.nodes.push(...nextPR.nodes);
      issueContributions.nodes.push(...nextIssue.nodes);

      issueCursor = nextIssue.edges[nextIssue.edges.length - 1].cursor;
      prCursor = nextPR.edges[nextPR.edges.length - 1].cursor;

      remainIssueTotal -= first;
      remainPRTotal -= first;
    }

    const filteredCommitCB = await Promise.all(
      commitContributionsByRepository.map(async (a) => {
        let count = 1;
        const ref = a.repository.ref;
        const extraRepoCommitRequest = async (repoName, repoCursor) => {
          const { repository } = await sdk.repoInfo({
            ...variables,
            repoName,
            repoCursor,
          });
          if (repository.ref.target.__typename !== 'Commit') return;
          const history = repository.ref.target.history;

          if (ref.target.__typename !== 'Commit') return;
          (ref.target.history.nodes as any[]).push(...history.nodes);
          console.log(count);
          count += 1;
          if (history.edges.length >= first) {
            await extraRepoCommitRequest(
              repoName,
              history.edges[history.edges.length - 1].cursor,
            );
          }
        };

        if (ref === null) return null;
        if (ref.target.__typename !== 'Commit') return;
        if (ref.target.history.edges.length >= first) {
          const edges = ref.target.history.edges;
          //  TODO await
          await extraRepoCommitRequest(
            a.repository.name,
            edges[edges.length - 1].cursor,
          ).catch((error) => {
            console.log(error);
          });
        }

        return ref.target.history.nodes.map((b) => ({
          repoName: a.repository.name,
          id: b.oid,
          type: ContributionType.Commit,
          date: dateToMysqlFormatString(b.committedDate),
          User: foundUser,
        }));
      }),
    );

    const flatReduce = (a, b) => {
      return b ? [...a, ...b] : a;
    };
    const FlatFilteredCommitCB: UserContribution[] =
      filteredCommitCB.reduce(flatReduce);

    const FlatFilteredPullRequestCB =
      pullRequestContributions.nodes.map<UserContribution>((pr) => ({
        repoName: pr.pullRequest.repository.name,
        id: pr.pullRequest.id,
        type: ContributionType.PullRequest,
        date: dateToMysqlFormatString(pr.pullRequest.updatedAt),
        User: foundUser,
      }));

    const FlatFilteredIssueCB = issueContributions.nodes.map<UserContribution>(
      (pr) => ({
        repoName: pr.issue.repository.name,
        id: pr.issue.id,
        type: ContributionType.Issue,
        date: dateToMysqlFormatString(pr.issue.updatedAt),
        User: foundUser,
      }),
    );

    const userDayStats: { [key: string]: Omit<UserDayStats, 'User'> } = {};

    const CBInstances: UserContribution[] = [
      ...FlatFilteredPullRequestCB,
      ...FlatFilteredCommitCB,
      ...FlatFilteredIssueCB,
    ].map((c) => {
      const date = dayjs(c.date).format('YYYY-MM-DD');

      if (!userDayStats.hasOwnProperty(date)) {
        userDayStats[date] = {
          total: 0,
          date,
          commit: 0,
          pullRequest: 0,
          issue: 0,
          fk_user_id: foundUser.id,
        };
      }

      switch (c.type) {
        case ContributionType.Commit:
          userDayStats[date].commit += 1;
          break;
        case ContributionType.PullRequest:
          userDayStats[date].pullRequest += 1;
          break;
        case ContributionType.Issue:
          userDayStats[date].issue += 1;
          break;
      }
      userDayStats[date].total += 1;

      return this.userContributions.create(c);
    });

    console.dir(CBInstances, { depth: null });
    console.dir(userDayStats, { depth: null });

    try {
      await this.userContributions.save(CBInstances, { chunk: 100 });
      foundUser.userDayStats = await this.userDayStats.save(
        Object.values(userDayStats),
      );
    } catch (error) {
      console.log(error);
    }
    // redisClient.del(`us${userId}`);
    foundUser.lastSyncedAt = new Date();
    try {
      await this.users.save(foundUser);
    } catch (error) {
      console.error(error);
    }
    return foundUser;
  }
}
