/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: findRoomsQuery
// ====================================================

export interface findRoomsQuery_findRooms_rooms_creator {
  __typename: "User";
  username: string;
}

export interface findRoomsQuery_findRooms_rooms_tags {
  __typename: "Tag";
  name: string;
  icon: string | null;
}

export interface findRoomsQuery_findRooms_rooms {
  __typename: "Room";
  id: number;
  name: string;
  description: string | null;
  maxNum: number | null;
  creator: findRoomsQuery_findRooms_rooms_creator;
  tags: findRoomsQuery_findRooms_rooms_tags[] | null;
}

export interface findRoomsQuery_findRooms {
  __typename: "FindRoomsOutput";
  rooms: findRoomsQuery_findRooms_rooms[];
}

export interface findRoomsQuery {
  findRooms: findRoomsQuery_findRooms;
}
