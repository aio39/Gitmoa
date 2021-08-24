import { NestFactory } from '@nestjs/core';
import { SlUserSyncModule } from 'apps/sl-user-sync/src/sl-user-sync.module';
import { SlUserSyncService } from 'apps/sl-user-sync/src/sl-user-sync.service';
import { Callback, Context, Handler } from 'aws-lambda';

export const userSync: Handler = async (
  event: any,
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
  try {
    const user = await appService.userSync();
  } catch (error) {
    console.log(error);
    return JSON.stringify(error);
  }
  return 'aaaaaa';
};
