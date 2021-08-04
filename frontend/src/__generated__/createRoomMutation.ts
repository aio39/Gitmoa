/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { CreateRoomInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: createRoomMutation
// ====================================================

export interface createRoomMutation_createRoom {
  __typename: "CreateRoomOutput";
  ok: boolean;
  error: string | null;
  roomId: number;
  secretLink: string;
}

export interface createRoomMutation {
  createRoom: createRoomMutation_createRoom;
}

export interface createRoomMutationVariables {
  createRoomInput: CreateRoomInput;
}
