/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: findMeQuery
// ====================================================

export interface findMeQuery_findUserMe_user {
  __typename: "User";
  /**
   * GitHub Unique ID
   */
  id: number;
  /**
   * GitHub Display Name
   */
  displayName: string;
  profileUrl: string;
}

export interface findMeQuery_findUserMe {
  __typename: "FindUserMeOutput";
  user: findMeQuery_findUserMe_user | null;
}

export interface findMeQuery {
  findUserMe: findMeQuery_findUserMe;
}
