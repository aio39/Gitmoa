import { gql } from 'graphql-request';

export const query = gql`
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

export const repoQuery = gql`
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

export const cursorQuery = gql`
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
