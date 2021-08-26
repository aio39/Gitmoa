import {
  MessageAttributeValue,
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
import { All, Get, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as dayjs from 'dayjs';
import { GraphQLClient } from 'graphql-request';
import * as redis from 'redis';
import { Repository } from 'typeorm';
import { promisify } from 'util';
import { getSdk, SdkFunctionWrapper } from './gql_codegen/gh_gql_type';
import { dateToMysqlFormatString, splitArrayByNumber } from './utils';

const lambdaVar = {
  user: 'aio39',
};

const REGION = process.env.REGION;
const QUEUE_NAME = 'gitmoa_update_room_queue';
const QUERY_URL =
  'https://sqs.ap-northeast-2.amazonaws.com/324744157557/gitmoa_update_room_queue';

type roomMessageAttribute = {
  [key in 'roomId' | 'fromDate' | 'toDate']: MessageAttributeValue;
};
interface roomMessage extends SendMessageBatchRequestEntry {
  MessageAttributes: roomMessageAttribute;
}

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

    const sqsClient = new SQSClient({ region: REGION });
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
          QueueUrl: QUERY_URL,
          Entries: messageList,
        };

        return sqsClient.send(new SendMessageBatchCommand(params));
      }),
    );
    const resultHttpStatus = sqsLoadRequests.map((result) => {
      this.logger.debug(`${result?.Failed?.[0].SenderFault} `);
      this.logger.debug(`${result?.Successful?.[0].MessageId} `);
      return result.$metadata.httpStatusCode;
    });

    return resultHttpStatus;
  }

  @Get('rqc') // 5분 마다 sqs에 업데이트 해야할 방 있는 지 확인해서, 룸 싱크 함수를 실행
  async roomSyncConsumer(): Promise<any> {
    const sqsClient = new SQSClient({ region: REGION });
    const params = {
      AttributeNames: ['SentTimestamp'],
      MaxNumberOfMessages: 10,
      MessageAttributeNames: ['All'],
      QueueUrl: QUERY_URL,
      VisibilityTimeout: 300,
      WaitTimeSeconds: 0,
    };
    const data = await sqsClient.send(new ReceiveMessageCommand(params));
    // const tempLambda = () => {};
    if (data.$metadata.httpStatusCode === 200 && data.Messages) {
      data.Messages.forEach((payload) => {
        const MessageAttributes =
          payload.MessageAttributes as roomMessageAttribute;

        console.log(payload.Attributes);
        console.log(payload.MessageAttributes);
        // tempLambda();
      });
    }

    return null;
  }

  @Get('rs')
  async roomSync() {
    const redisClient = redis.createClient({
      host: process.env.REDIS_HOST,
      port: +process.env.REDIS_PORT,
      password: process.env.REDIS_PASSWORD,
    });
    // const fromDate = '2021-04-01T15:00:00Z';
    const fromDate = '2021-01-01';
    // const toDate = '2021-06-30T15:00:00Z';
    const toDate = '2021-06-30';
    const roomId = 9;
    // 방에 포함된 모든 유저 데이터를 가져오고 ,

    const foundRoom = await this.rooms.findOne(roomId, {
      relations: ['participants'], //'participants.userDayStats'
    });
    const updatedUserList: User[] = [];
    const notUpdatedUserList: User[] = [];
    // 최근 1시간내에 업데이트 되지 않은 리스트 A를 추려와서
    foundRoom.participants.forEach((user) => {
      const isUpdatedInLast1H = dayjs(user.lastSyncedAt).isAfter(
        dayjs().subtract(1, 'day'),
      );
      if (isUpdatedInLast1H) {
        updatedUserList.push(user);
      } else {
        notUpdatedUserList.push(user);
      }
    });
    // redis를 체크해서 이미 동기화 요청이 들어왔는지 확인하고
    //  안 하고 있다면 요청을 보내서 데이터를 받아옴 / await TASK A
    type UserId = User['id'];
    const nowInRedisList: UserId[] = [];
    const nowNotInRedisList: UserId[] = [];
    console.time('all a');
    await Promise.all(
      notUpdatedUserList.map((user): Promise<boolean> => {
        return promisify(redisClient.exists).bind(redisClient)('us' + user.id);
      }),
    ).then((results) => {
      results.forEach((isExist, idx) => {
        const user = notUpdatedUserList[idx];
        if (isExist) {
          nowInRedisList.push(user.id);
        } else {
          nowNotInRedisList.push(user.id);
        }
      });
    });
    console.timeEnd('all a');
    const requestUserSync: User[] = await Promise.all(
      nowNotInRedisList.map((userId) => {
        redisClient.set('us' + userId, '1');
        return this.userSync();
      }),
    );
    //  TASK A가 끝나고 나서, Redis를 다시 체크해서 아직 안 끝났다면 직접 UserSync .
    const finishedRedisList: UserId[] = [];
    const maybeFailedList: UserId[] = [];

    console.time('all b');
    await Promise.all(
      nowNotInRedisList.map(async (id) => {
        const isExist = await redisClient.exists('us' + id);
        if (isExist) {
          // 아직도 안 끝날걸 보아 sync 에러가 생긴거 같으니 직접 sync 요청
          maybeFailedList.push(id);
        } else {
          // 다른 곳에서 신청한 sync가 끝났으니 db에서 가져온다청
          // finishedRedisList.push(id);
        }
        return;
      }),
    );
    console.timeEnd('all b');

    await Promise.all(
      maybeFailedList.map((id) => {
        return this.roomSync();
      }),
    );

    const userList = foundRoom.participants.map((user) => user.id);

    type DayStatus = Pick<
      RoomDayStats,
      'date' | 'total' | 'commit' | 'issue' | 'pullRequest' | 'isAllCommit'
    >;
    const dayStats: DayStatus[] = await this.userDayStats
      .createQueryBuilder('stats')
      .select([
        'stats.date as date',
        'sum(stats.total) as total',
        'sum(stats.commit) as commit',
        'sum(stats.pullRequest) as pullRequest',
        'sum(stats.issue) as issue',
      ])
      // .where('stats.fk_user_id in :user_list', { user_list: userList })
      // .where('stats.date BETWEEN :from AND :to  ', {
      //   from: fromDate,
      //   to: toDate,
      // })
      .groupBy('date')
      .getRawMany();

    const roomDayStatsInstance = dayStats.map((day, idx) => {
      // TODO 으어어 이거 나중에 사람 늘어나는거 어떻게 처리?
      const newRD = new RoomDayStats();
      newRD.isAllCommit = day.total === foundRoom.participants.length;
      newRD.date_room_id = day.date + '-' + foundRoom.id;
      Object.assign(newRD, day);
      return newRD;
      // return day;
    });

    foundRoom.RoomDayStats = roomDayStatsInstance;
    // try {
    //   const result = await this.rooms.update(foundRoom.id, {
    //     RoomDayStats: roomDayStatsInstance,
    //   });
    // } catch (error) {
    //   console.log(error);
    // }
    try {
      await this.rooms.save(foundRoom);
    } catch (error) {
      console.log(error);
    }

    // console.log(result);
    // await this.rooms.findOne(roomId, {
    //   relations: ['participants'],
    //   where: { 'participants.id': In(maybeFailedList) },
    // });

    // DB에 저장하기

    // 완료되면 SQS Finish 요청을 보냄.
  }

  @All('us')
  async userSync() {
    const accessToken = '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';
    const userId: number = +'68348070';
    const endpoint = 'https://api.github.com/graphql';

    const fromDate = '2021-04-01T15:00:00Z';
    const toDate = '2021-06-30T15:00:00Z';
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