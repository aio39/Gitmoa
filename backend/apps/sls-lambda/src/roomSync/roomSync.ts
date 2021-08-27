import { NestFactory } from '@nestjs/core';
import { LambdaModule } from 'apps/sls-lambda/src/lambda.module';
import { LambdaService } from 'apps/sls-lambda/src/lambda.service';
import { roomSyncEvent } from 'apps/sls-lambda/src/roomSync/type';
import { Callback, Context, Handler } from 'aws-lambda';

export const roomSync: Handler = async (
  event: roomSyncEvent,
  context: Context,
  callback: Callback,
) => {
  const appContext = await NestFactory.createApplicationContext(LambdaModule);
  const appService = appContext.get(LambdaService);
  const user = await appService.roomSync(event);

  console.log('room sync!');
  callback(null, JSON.stringify({ ok: 'ok' }));
};
