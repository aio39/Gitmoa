import { roomSyncEvent } from 'apps/sls-lambda/src/roomSync/type';
import { Callback, Context, Handler } from 'aws-lambda';

export const roomSync: Handler = async (
  event: roomSyncEvent,
  context: Context,
  callback: Callback,
) => {
  // const appContext = await NestFactory.createApplicationContext(
  //   SlUserSyncModule,
  // );

  // const appService = appContext.get(SlUserSyncService);
  // const user = await appService.getHello();
  console.log(event.ReceiptHandle);
  console.log('room sync!');
  callback(null, JSON.stringify({ ok: 'ok' }));
};
