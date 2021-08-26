import { NestFactory } from '@nestjs/core';
import { LambdaModule } from 'apps/sls-lambda/src/lambda.module';
import { LambdaService } from 'apps/sls-lambda/src/lambda.service';
import { Callback, Context, Handler } from 'aws-lambda';

type TEvent = {
  param: string;
};
type TResult = any;

export const roomSyncConsumer: Handler<TEvent, TResult> = async (
  event,
  context: Context,
  callback: Callback,
) => {
  // console.log(event);

  const appContext = await NestFactory.createApplicationContext(LambdaModule);

  const appService = appContext.get(LambdaService);
  const result = await appService.roomSyncConsumer();

  // const lambdaConfig: any = {};
  // if (process.env.NODE_ENV === 'dev') {
  //   lambdaConfig.endpoint = 'http://localhost:3002'; // NOTE 3002번 포트,
  // }
  // const lambda = new Lambda({
  //   ...lambdaConfig,
  // });

  // callback(null, JSON.stringify(result));
  callback(null, JSON.stringify({ result }));
};
