import { NestFactory } from '@nestjs/core';
import { LambdaModule } from 'apps/sls-lambda/src/lambda.module';
import { LambdaService } from 'apps/sls-lambda/src/lambda.service';
import { userSyncEvent } from 'apps/sls-lambda/src/userSync/type';
import { Callback, Context, Handler } from 'aws-lambda';

export const userSync: Handler = async (
  event: userSyncEvent,
  context: Context,
  callback: Callback,
) => {
  console.log(event);
  console.log(context);
  console.log(process.env);

  const appContext = await NestFactory.createApplicationContext(LambdaModule);

  const appService = appContext.get(LambdaService);
  try {
    const user = await appService.userSync(event);
  } catch (error) {
    console.log(error);
    return JSON.stringify(error);
  }
  return 'aaaaaa';
};
