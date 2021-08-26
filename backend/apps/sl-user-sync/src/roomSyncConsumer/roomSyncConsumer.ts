import sls_fn_names from 'apps/sl-user-sync/src/sls_const';
import { Callback, Context, Handler } from 'aws-lambda';
import { Lambda } from 'aws-sdk';

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
  // console.log(context);

  // const appContext = await NestFactory.createApplicationContext(
  //   SlUserSyncModule,
  // );
  const lambdaConfig: any = {};
  if (process.env.NODE_ENV === 'dev') {
    lambdaConfig.endpoint = 'http://localhost:3002'; // NOTE 3002번 포트,
    // process.env.STAGE 트
    // '/' +
    // sls_fn_names.ROOM_SYNC;
  }

  // const appService = appContext.get(SlUserSyncService);
  // const result = await appService.roomSyncConsumer();
  const lambda = new Lambda({
    ...lambdaConfig,
  });

  const result = await lambda
    .invoke({
      FunctionName: sls_fn_names.ROOM_SYNC,
      InvocationType: 'RequestResponse ',
      Payload: JSON.stringify({ test: 'testPayload' }),
    })
    .promise()
    .catch((err) => {
      console.log(err);
    });
  // .send((err, data) => {
  //   console.log(err);
  //   console.log(data);
  // });

  console.log(result);

  // callback(null, JSON.stringify(result));
  return JSON.stringify(result);
};
