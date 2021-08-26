import { NestFactory } from '@nestjs/core';
import { SlUserSyncModule } from 'apps/sls-lambda/src/sl-user-sync.module';
import { SlUserSyncService } from 'apps/sls-lambda/src/sl-user-sync.service';
import { Callback, Context, Handler } from 'aws-lambda';

export const testHandler: Handler = async (
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
    const user = await appService.getHello();
  } catch (error) {
    console.log(error);
  }

  // callback(null, user);
  // callback(null, JSON.stringify(user));
  return '1234';
};
