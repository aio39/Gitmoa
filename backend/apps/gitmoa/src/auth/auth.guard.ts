import { HttpException, HttpStatus } from '@nestjs/common';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';
import { IConfigService } from '../common/config-interface';
import { RoomsService } from '../rooms/rooms.service';
import { UsersService } from '../users/users.service';
import { AllowedRoles, ROLES_KEY } from './auth-decorator/roles.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
    private readonly userService: UsersService,
    private readonly roomService: RoomsService,
    private readonly configService: ConfigService<IConfigService>,
  ) {}
  async canActivate(context: ExecutionContext) {
    const roles = this.reflector.get<AllowedRoles>(
      ROLES_KEY,
      context.getHandler(),
    );
    if (!roles) return true;

    const gqlContext = GqlExecutionContext.create(context).getContext();
    const token = gqlContext.token;
    if (token) {
      const decoded = this.jwtService.verify(token.toString());
      // secret: this.configService.get('SECRET_KEY'),
      gqlContext['user'] = { id: decoded.id };
    }

    if (roles.includes(AllowedRoles.Login)) {
      if (!token) return false;
      return true;
    }

    const gqlArgs = GqlExecutionContext.create(context).getArgs();
    const findUserPromise = this.userService.findUserById(gqlContext.user.id);
    const findRoomPromise = this.roomService.findRoomById(gqlArgs.id);
    const [{ user }, { room }] = await Promise.all([
      findUserPromise,
      findRoomPromise,
    ]);
    if (!user)
      throw new HttpException(
        { status: HttpStatus.NOT_FOUND, error: 'Could not find User' },
        HttpStatus.NOT_FOUND,
      );
    if (!room)
      throw new HttpException(
        { status: HttpStatus.NOT_FOUND, error: 'Could not find room' },
        HttpStatus.NOT_FOUND,
      );
    if (roles.includes(AllowedRoles.Creator)) {
      if (user.id !== room.creatorId) {
        return false;
      }
    }
    if (roles.includes(AllowedRoles.NotCreator)) {
      if (user.id === room.creatorId) {
        return false;
      }
    }
    if (roles.includes(AllowedRoles.Admin)) {
      const adminListString = this.configService.get('ADMIN_ID_LIST', {
        infer: true,
      });
      const adminList: number[] = adminListString
        .split('/')
        .map((id) => parseInt(id));
      if (!adminList.includes(user.id)) return false;
    }

    return true;
  }
}
