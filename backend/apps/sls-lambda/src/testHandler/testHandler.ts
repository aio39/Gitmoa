import { NestFactory } from '@nestjs/core';
import { LambdaModule } from 'apps/sls-lambda/src/lambda.module';
import { LambdaService } from 'apps/sls-lambda/src/lambda.service';
import { Callback, Context, Handler } from 'aws-lambda';

export const testHandler: Handler = async (
  event: any,
  context: Context,
  callback: Callback,
) => {
  console.log(event);
  console.log(context);
  console.log(process.env);

  const appContext = await NestFactory.createApplicationContext(LambdaModule);
  const appService = appContext.get(LambdaService);
  try {
    const user = await appService.getHello();
  } catch (error) {
    console.log(error);
  }

  // callback(null, user);
  // callback(null, JSON.stringify(user));
  return '1234';
};
