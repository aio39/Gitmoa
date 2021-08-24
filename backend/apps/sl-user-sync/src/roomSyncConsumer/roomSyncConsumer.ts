import { NestFactory } from '@nestjs/core';
import { SlUserSyncModule } from 'apps/sl-user-sync/src/sl-user-sync.module';
import { SlUserSyncService } from 'apps/sl-user-sync/src/sl-user-sync.service';
import { Callback, Context, Handler } from 'aws-lambda';

type TEvent = {
  param: string;
};
type TResult = number[];

export const roomSyncConsumer: Handler<TEvent, TResult> = async (
  event,
  context: Context,
  callback: Callback,
) => {
  console.log(event);
  console.log(context);
  console.log(process.env);

  const appContext = await NestFactory.createApplicationContext(
    SlUserSyncModule,
  );
  const appService = appContext.get(SlUserSyncService);
  const result = await appService.roomSyncConsumer();

  // callback(null, JSON.stringify(result));
  return result;
};
