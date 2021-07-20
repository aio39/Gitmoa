// import { NestFactory } from '@nestjs/core';
// import { SlUserSyncModule } from './sl-user-sync.module';
// import { Callback, Context, Handler } from 'aws-lambda';
// import serverlessExpress from '@vendia/serverless-express';

// let server: Handler;

// async function bootstrap(): Promise<Handler> {
//   const app = await NestFactory.create(SlUserSyncModule);
//   await app.init();

//   const expressApp = app.getHttpAdapter().getInstance();
//   return serverlessExpress({ app: expressApp });
// }

// export const handler: Handler = async (
//   event: any,
//   context: Context,
//   callback: Callback,
// ) => {
//   server = server ?? (await bootstrap());
//   // return server(event, context, callback);
//   return { hello: 'serverless' };
// };

// import { HttpStatus } from '@nestjs/common';
// import { NestFactory } from '@nestjs/core';
// import { SlUserSyncModule } from 'apps/sl-user-sync/src/sl-user-sync.module';
// import { SlUserSyncService } from 'apps/sl-user-sync/src/sl-user-sync.service';
// import { Callback, Context, Handler } from 'aws-lambda';

// export const handler: Handler = async (
//   event: any,
//   context: Context,
//   callback: Callback,
// ) => {
//   const appContext = await NestFactory.createApplicationContext(
//     SlUserSyncModule,
//   );
//   const appService = appContext.get(SlUserSyncService);

//   return {
//     body: appService.getHello(),
//     statusCode: HttpStatus.OK,
//   };
// };

export * from './handlerA';
