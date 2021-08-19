import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as Joi from 'joi';
import { GraphQLModule } from '@nestjs/graphql';
import { CommonModule } from './common/common.module';
import { RoomsModule } from './rooms/rooms.module';
import {
  User,
  UserContribution,
  UserDayStats,
  Tag,
  Room,
  RoomDayCommitter,
  RoomDayStats,
} from '@lib/entity';
import { TelegrafModule } from 'nestjs-telegraf';
import { TelegramModule } from 'apps/gitmoa/src/telegram/telegram.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { DataLoaderInterceptor } from 'apps/gitmoa/src/common/dataloader';
import { TestModule } from './test/test.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // 글로벌 모듈로 선언
      cache: true, // 액세스 속도 상승
      expandVariables: true, //  ${} 사용가능
      envFilePath:
        process.env.NODE_ENV === 'dev'
          ? ['.env.dev', '.env.development']
          : '.env.test',
      ignoreEnvFile: process.env.NODE_ENV === 'prod', // prod 모드에서는 런타임 환경에 환경변수 받음.
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('dev', 'prod', 'test')
          .required()
          .default('dev'),
        PORT: Joi.number().required().default(4000),
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.number().required(),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_NAME: Joi.string().required(),
        JWT_EXPIRES_IN: Joi.required(),
      }),
      validationOptions: {
        allowUnknown: true, // 알 수 없는 키 거부,
        abortEarly: false, // 일단 모드를 키를  검사 후 에러 반환환
      },
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      synchronize: process.env.NODE_ENV !== 'prod', // TypeOrm의 Entity에 맞춰 실제 DB에 Migration
      logging: process.env.NODE_ENV !== 'prod',
      entities: [
        User,
        UserContribution,
        UserDayStats,
        Tag,
        Room,
        RoomDayCommitter,
        RoomDayStats,
      ],
    }),
    GraphQLModule.forRoot({
      // installSubscriptionHandlers: true, // NOTE ws 활성화
      autoSchemaFile: true,
      cors: {
        origin: 'http://localhost:3000',
        credentials: true,
      },
      context: ({ req, connection }) => {
        const TOKEN_KEY = 'x-jwt';
        return {
          token: req ? req.headers[TOKEN_KEY] : connection.context[TOKEN_KEY],
        };
      },
      debug: true,
    }),
    // TelegrafModule.forRoot({
    //   token: process.env.TELEGRAM_BOT_TOKEN,
    //   include: [TelegramModule],
    // }),
    // TelegramModule,
    AuthModule,
    UsersModule,
    CommonModule,
    RoomsModule,
    TestModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: DataLoaderInterceptor,
    },
  ],
  controllers: [],
})
export class AppModule {}
