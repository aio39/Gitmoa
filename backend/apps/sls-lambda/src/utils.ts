import { User } from '@lib/entity';
import { LogLevel } from '@nestjs/common';
import * as dayjs from 'dayjs';

export const dateToMysqlFormatString = (date: Date = new Date()): string => {
  return dayjs(date).format('YYYY-MM-DD HH:mm:ss');
};

export const splitArrayByNumber = <T>(array: T[], num: number) => {
  let i;
  const j = array.length;
  const result = [];
  for (i = 0; i < j; i += num) {
    result.push(array.slice(i, i + num));
  }
  return result;
};

export const loggingLevel = (stage = 'prod'): LogLevel[] | boolean => {
  if (stage === 'dev') return true;
  return ['log', 'error'];
};

export const rmUndefinedFields = <T>(obj: T) => {
  Object.keys(obj).forEach((key) => obj[key] === undefined && delete obj[key]);
  return obj;
};

export const genRedisUserSyncKey = (userId: User['id']) => `us${userId}`;
