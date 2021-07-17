import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { GithubStrategy } from './githubOauth/github.strategy';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth.guard';
import { JwtStrategy } from './jwt/jwt.strategy';
import { config } from 'dotenv';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RoomsModule } from '../rooms/rooms.module';
import { User } from '@lib/entity';

config();

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    UsersModule,
    RoomsModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('SECRET_KEY'),
        signOptions: { expiresIn: configService.get<string>('JWT_EXPIRES_IN') },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    AuthService,
    GithubStrategy,
    JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
  controllers: [AuthController],
})
export class AuthModule {}
