import { Controller, All } from '@nestjs/common';
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
import { Repository } from 'typeorm';

const lambdaVar = {
  user: 'aio39',
};

const query = gql`
  query userInfo(
    $login: String!
    $fromDate: DateTime!
    $toDate: DateTime!
    $first: Int!
  ) {
    user(login: $login) {
      contributionsCollection(from: $fromDate, to: $toDate) {
        pullRequestContributions(first: $first) {
          totalCount
          edges {
            cursor
          }
          nodes {
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
            cursor
          }
          nodes {
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
                ... on Commit {
                  history(first: $first) {
                    edges {
                      cursor
                    }
                    nodes {
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
  query userInfo(
    $login: String!
    $fromDate: DateTime!
    $toDate: DateTime!
    $first: Int!
    $issueCursor: Cursor!
    $prCursor: String!
  ) {
    user(login: $login) {
      contributionsCollection(from: $fromDate, to: $toDate) {
        pullRequestContributions(first: $first, after: $issueCursor) {
          totalCount
          edges {
            cursor
          }
          nodes {
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
          nodes {
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
    $toDate: GitTimestamp!
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
              since: $toDate
              author: { id: "MDQ6VXNlcjY4MzQ4MDcw" }
            ) {
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

export interface ISorPRContributions {
  totalCount: number;
  edges: Edge[];
  nodes: Node[];
}

export interface Edge {
  cursor: string;
}

export enum InNodeKey {
  pullRequest,
  issue,
}

export interface Node {
  pullRequest?: IRequest;
  issue?: IRequest;
}

export interface IRequest {
  updatedAt: Date;
  id: string;
  repository: RepositoryPR;
}

export interface RepositoryPR {
  name: string;
}

/////////////////////
export interface CommitContributionRepo {
  repository: RepositoryA;
}

export interface RepositoryA {
  languages: Languages;
  name: string;
  ref: Ref;
}

export interface Languages {
  edges: Edge[];
}

export interface Edge {
  size: number;
  node: EdgeNode;
}

export interface EdgeNode {
  color: string;
  name: string;
}

export interface Ref {
  target: Target;
}

export interface Target {
  history: History;
}

export interface History {
  nodes: NodeElement[];
  edges: Edge[];
}

export interface NodeElement {
  oid: string;
  id: string;
  abbreviatedOid: string;
  authoredByCommitter: boolean;
  committedDate: Date;
  message: string;
}

// Generated by https://quicktype.io

export interface IrepoQuery {
  repository: RepositoryB;
}

export interface RepositoryB {
  name: string;
  ref: Ref2;
}

export interface Ref2 {
  target: Target2;
}

export interface Target2 {
  history: History2;
}

export interface History2 {
  edges: Edge[];
  nodes: Node[];
}

export interface Edge {
  cursor: string;
}

export interface Node {
  author: Author;
  oid: string;
  id: string;
  abbreviatedOid: string;
  authoredByCommitter: boolean;
  committedDate: Date;
  message: string;
}

export interface Author {
  name: string;
  user: UserA;
}

export interface UserA {
  id: string;
}

@Controller('test')
export class TestController {
  constructor(
    private readonly testService: TestService,
    @InjectRepository(User) private readonly users: Repository<User>,
    @InjectRepository(UserContribution)
    private readonly userContributions: Repository<UserContribution>,
    @InjectRepository(UserDayStats)
    private readonly userDayStats: Repository<UserDayStats>,
  ) {}

  @All()
  async create() {
    const accessToken = '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';
    const userId: number = +'68348070';
    const endpoint = 'https://api.github.com/graphql';

    const fromDate = '2020-08-01T15:00:00Z';
    const toDate = '2021-07-15T15:00:00Z';
    const first = 100;

    const user = await this.users.findOne(userId);
    const variables = {
      login: user.username,
      fromDate,
      toDate,
      first,
    };

    const graphQLClient = new GraphQLClient(endpoint, {
      headers: {
        authorization: `Bearer ${user.accessToken}`,
      },
    });

    const data = await graphQLClient
      .request(query, variables)
      .catch((error) => {
        console.log(error);
      });

    const {
      commitContributionsByRepository,
      pullRequestContributions,
      issueContributions,
    }: {
      commitContributionsByRepository: Array<CommitContributionRepo>;
      pullRequestContributions: ISorPRContributions;
      issueContributions: ISorPRContributions;
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
      const data = await graphQLClient
        .request(query, { ...variables, issueCursor, prCursor })
        .catch((error) => {
          console.log(error);
        });
      const {
        pullRequestContributions: nextPR,
        issueContributions: nextIssue,
      }: {
        pullRequestContributions: ISorPRContributions;
        issueContributions: ISorPRContributions;
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

    const filteredCommitCB = commitContributionsByRepository.map((a) => {
      let count = 1;
      const ref = a.repository.ref;
      const extraRepoCommitRequest = async (repoName, repoCursor) => {
        const {
          repository: {
            ref: {
              target: { history },
            },
          },
        }: { repository: RepositoryB } = await graphQLClient
          .request(repoQuery, {
            ...variables,
            repoName,
            authorId: 'aiofdsfds',
            repoCursor,
          })
          .then((a) => {
            return a;
          })
          .catch((error) => {
            console.log(error);
          });
        ref.target.history.nodes.push(...history.nodes);
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
      if (ref.target.history.edges.length >= first) {
        const edges = ref.target.history.edges;
        //  TODO await
        extraRepoCommitRequest(
          a.repository.name,
          edges[edges.length - 1].cursor,
        );
      }

      return ref.target.history.nodes.map((b) => ({
        repoName: a.repository.name,
        id: b.oid,
        type: ContributionType.Commit,
        date: dateToMysqlFormatString(b.committedDate),
        User: user,
      }));
    });
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
