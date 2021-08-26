import { NestFactory } from '@nestjs/core';
import { LambdaModule } from 'apps/sls-lambda/src/lambda.module';
import { LambdaService } from 'apps/sls-lambda/src/lambda.service';
import {
  roomSyncLoadToSQSEvent,
  roomSyncLoadToSQSResult,
} from 'apps/sls-lambda/src/roomSyncLoadToSQS/type';
import { Context, Handler } from 'aws-lambda';

export const roomSyncLoadToSQS: Handler<
  roomSyncLoadToSQSEvent,
  roomSyncLoadToSQSResult
> = async (event, context: Context) => {
  console.log(event);

  const appContext = await NestFactory.createApplicationContext(LambdaModule);
  const appService = appContext.get(LambdaService);
  const result = await appService.roomSyncLoadToSQS();

  return result;
};
