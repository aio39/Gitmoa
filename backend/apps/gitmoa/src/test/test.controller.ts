import {
  getSdk,
  SdkFunctionWrapper,
  Repository,
} from './../../../../gqlType/graphql';
import { Controller, All, Get } from '@nestjs/common';
import { TestService } from './test.service';
import { GraphQLClient, gql } from 'graphql-request';
import {
  ContributionType,
  User,
  UserContribution,
  UserDayStats,
} from '@lib/entity';
import * as dayjs from 'dayjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository as RepositoryTypeOrm } from 'typeorm';
import { from } from 'rxjs';

const lambdaVar = {
  user: 'aio39',
};

const query = gql`
  query userInfo(
    $login: String!
    $fromDate: DateTime!
    $toDate: DateTime!
    $untilDate: GitTimestamp
    $sinceDate: GitTimestamp
    $first: Int!
  ) {
    user(login: $login) {
      contributionsCollection(from: $fromDate, to: $toDate) {
        pullRequestContributions(first: $first) {
          totalCount
          edges {
            __typename
            cursor
          }
          nodes {
            __typename
            pullRequest {
              updatedAt
              id
              repository {
                name
              }
            }
          }
        }

        issueContributions(first: $first) {
          totalCount
          edges {
            __typename
            cursor
          }
          nodes {
            __typename
            issue {
              updatedAt
              authorAssociation
              id
              state
              author {
                resourcePath
              }
              title
              repository {
                name
              }
            }
            user {
              id
            }
          }
        }

        commitContributionsByRepository {
          repository {
            languages(
              first: $first
              orderBy: { field: SIZE, direction: DESC }
            ) {
              edges {
                size
                node {
                  color
                  name
                }
              }
            }
            name
            ref(qualifiedName: "main") {
              target {
                __typename
                ... on Commit {
                  history(first: $first, since: $sinceDate, until: $untilDate) {
                    __typename
                    edges {
                      cursor
                      __typename
                    }
                    nodes {
                      __typename
                      oid
                      id
                      abbreviatedOid
                      authoredByCommitter
                      committedDate
                      message
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

const cursorQuery = gql`
  query cursorQuery(
    $login: String!
    $fromDate: DateTime!
    $toDate: DateTime!
    $first: Int!
    $issueCursor: String!
    $prCursor: String!
  ) {
    user(login: $login) {
      contributionsCollection(from: $fromDate, to: $toDate) {
        pullRequestContributions(first: $first, after: $issueCursor) {
          totalCount
          edges {
            cursor
            __typename
          }
          nodes {
            __typename
            pullRequest {
              updatedAt
              id
              repository {
                name
              }
            }
          }
        }

        issueContributions(first: $first, after: $prCursor) {
          totalCount
          edges {
            cursor
            __typename
          }
          nodes {
            __typename
            issue {
              updatedAt
              authorAssociation
              id
              state
              author {
                resourcePath
              }
              title
              repository {
                name
              }
            }
            user {
              id
            }
          }
        }
      }
    }
  }
`;

const repoQuery = gql`
  query repoInfo(
    $login: String!
    $untilDate: GitTimestamp
    $sinceDate: GitTimestamp
    $first: Int!
    $repoCursor: String!
    $repoName: String!
  ) {
    repository(name: $repoName, owner: $login) {
      name
      ref(qualifiedName: "main") {
        target {
          ... on Commit {
            history(
              first: $first
              after: $repoCursor
              since: $sinceDate
              until: $untilDate
              author: { id: "MDQ6VXNlcjY4MzQ4MDcw" }
            ) {
              __typename
              edges {
                cursor
              }
              nodes {
                oid
                committedDate
              }
            }
          }
        }
      }
    }
  }
`;

@Controller('test')
export class TestController {
  constructor(
    private readonly testService: TestService,
    @InjectRepository(User) private readonly users: RepositoryTypeOrm<User>,
    @InjectRepository(UserContribution)
    private readonly userContributions: RepositoryTypeOrm<UserContribution>,
    @InjectRepository(UserDayStats)
    private readonly userDayStats: RepositoryTypeOrm<UserDayStats>,
  ) {}

  @All()
  async create() {
    const accessToken = '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';
    const userId: number = +'68348070';
    const endpoint = 'https://api.github.com/graphql';

    const fromDate = '2021-04-01T15:00:00Z';
    const toDate = '2021-06-30T15:00:00Z';
    const first = 10;

    const user = await this.users.findOne(userId);
    const variables = {
      login: user.username,
      fromDate,
      sinceDate: fromDate,
      toDate,
      untilDate: toDate,
      first,
    };

    const graphQLClient = new GraphQLClient(endpoint, {
      headers: {
        authorization: `Bearer ${user.accessToken}`,
      },
    });

    const clientTimingWrapper: SdkFunctionWrapper = async <T>(
      action: () => Promise<T>,
    ): Promise<T> => {
      const startTime = Date.now();
      const result = await action();
      console.log('request duration (ms)', Date.now() - startTime);
      return result;
    };

    const sdk = getSdk(graphQLClient, clientTimingWrapper);
    const data = await sdk.userInfo(variables);
    console.log(data);

    // const data = await graphQLClient
    //   .request(query, variables)
    //   .catch((error) => {
    //     console.log(error);
    //   });

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
      // graphQLClient
      //   .request(query, { ...variables, issueCursor, prCursor })
      //   .catch((error) => {
      //     console.log(error);
      //   });
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

    const dateToMysqlFormatString = (date: Date): string =>
      dayjs(date).format('YYYY-MM-DD HH:mm:ss');

    const filteredCommitCB = await Promise.all(
      commitContributionsByRepository.map(async (a) => {
        let count = 1;
        const ref = a.repository.ref;
        const extraRepoCommitRequest = async (repoName, repoCursor) => {
          const { repository } = await sdk.repoInfo({
            ...variables,
            repoName,
            // authorId: 'aio39',
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
          User: user,
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
        User: user,
      }));

    const FlatFilteredIssueCB = issueContributions.nodes.map<UserContribution>(
      (pr) => ({
        repoName: pr.issue.repository.name,
        id: pr.issue.id,
        type: ContributionType.Issue,
        date: dateToMysqlFormatString(pr.issue.updatedAt),
        User: user,
      }),
    );

    const userDayStats: { [key: string]: UserDayStats } = {};

    const CBInstances: UserContribution[] = [
      ...FlatFilteredPullRequestCB,
      ...FlatFilteredCommitCB,
      ...FlatFilteredIssueCB,
    ].map((c) => {
      const date = dayjs(c.date).format('YYYY-MM-DD');

      if (!userDayStats.hasOwnProperty(date)) {
        userDayStats[date] = {
          User: user,
          total: 0,
          date,
          commit: 0,
          pullRequest: 0,
          issue: 0,
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
      await this.userDayStats.save(Object.values(userDayStats));
    } catch (error) {
      console.log(error);
    }
  }
}
