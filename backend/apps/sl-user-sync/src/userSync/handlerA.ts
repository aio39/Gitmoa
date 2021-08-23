import { NestFactory } from '@nestjs/core';
import { SlUserSyncModule } from 'apps/sl-user-sync/src/sl-user-sync.module';
import { SlUserSyncService } from 'apps/sl-user-sync/src/sl-user-sync.service';
import { Callback, Context, Handler } from 'aws-lambda';

export const handlerA: Handler = async (
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
  const user = await appService.getHello();
  // callback(null, user);
  callback(null, JSON.stringify(user));
};

// export const handlerB: Handler = async (
//   event: any,
//   context: Context,
//   callback: Callback,
// ) => {
//   const appContext = await NestFactory.createApplicationContext(
//     SlUserSyncModule,
//   );
//   const appService = appContext.get(SlUserSyncService);

//   return {
//     body: 'BBBBB',
//     statusCode: HttpStatus.OK,
//   };
// };
