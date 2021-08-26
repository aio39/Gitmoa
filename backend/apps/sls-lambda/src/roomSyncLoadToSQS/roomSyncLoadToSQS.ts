import { NestFactory } from '@nestjs/core';
import { LambdaModule } from 'apps/sls-lambda/src/lambda.module';
import { LambdaService } from 'apps/sls-lambda/src/lambda.service';
import { roomSyncLoadToSQSEvent } from 'apps/sls-lambda/src/roomSyncLoadToSQS/type';
import { loggingLevel } from 'apps/sls-lambda/src/utils';
import { Callback, Context, Handler } from 'aws-lambda';

export const roomSyncLoadToSQS: Handler<roomSyncLoadToSQSEvent> = async (
  // roomSyncLoadToSQSResult
  event,
  context: Context,
  callback: Callback,
) => {
  console.log(event);

  const app = await NestFactory.createApplicationContext(LambdaModule, {
    logger: loggingLevel(process.env.NODE_ENV),
  });
  const lambdaService = app.get(LambdaService);
  const result = await lambdaService.roomSyncLoadToSQS();
  console.log(result);

  callback(null, JSON.stringify({ result }));
};
