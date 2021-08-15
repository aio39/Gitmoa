/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

export interface CreateRoomInput {
  name: string;
  description?: string | null;
  isSecret?: boolean | null;
  isCanSearched?: boolean | null;
  maxNum?: number | null;
  password?: string | null;
  tags?: TagInput[] | null;
}

export interface GetUserDayStatsInput {
  userId: number;
  from: string;
  to: string;
}

export interface TagInput {
  name: string;
  icon?: string | null;
}

//==============================================================
// END Enums and Input Objects
//==============================================================
