/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { GetUserDayStatsInput } from "./globalTypes";

// ====================================================
// GraphQL query operation: getUserDayStatsQuery
// ====================================================

export interface getUserDayStatsQuery_getUserDayStats_dayStats {
  __typename: "UserDayStats";
  date: string;
  total: number;
  commit: number;
  pullRequest: number;
  issue: number;
}

export interface getUserDayStatsQuery_getUserDayStats {
  __typename: "GetUserDayStatsOutput";
  error: string | null;
  ok: boolean;
  dayStats: getUserDayStatsQuery_getUserDayStats_dayStats[] | null;
}

export interface getUserDayStatsQuery {
  getUserDayStats: getUserDayStatsQuery_getUserDayStats;
}

export interface getUserDayStatsQueryVariables {
  input: GetUserDayStatsInput;
}
