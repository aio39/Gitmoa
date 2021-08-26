import { Callback, Context, Handler } from 'aws-lambda';

export const roomSync: Handler = async (
  event: any,
  context: Context,
  callback: Callback,
) => {
  console.log(event);
  console.log(context);
  console.log(process.env);

  // const appContext = await NestFactory.createApplicationContext(
  //   SlUserSyncModule,
  // );

  // const appService = appContext.get(SlUserSyncService);
  // const user = await appService.getHello();
  console.log(event.test);
  console.log('room sync!');
  return Promise.resolve('ok');
};
