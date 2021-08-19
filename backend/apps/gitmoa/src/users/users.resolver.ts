import { Resolver, Query, Args } from '@nestjs/graphql';
import { UsersService } from './users.service';
import {
  FindUserByIdInput,
  FindUserByIdOutput,
} from './dto/find-user-by-id.dto';
import { AuthUser } from '../auth/auth-decorator/auth-user.decorator';
import { User, UserDayStats } from '@lib/entity';
import {
  AllowedRoles,
  Roles,
} from 'apps/gitmoa/src/auth/auth-decorator/roles.decorator';
import {
  GetUserDayStatsInput,
  GetUserDayStatsOutput,
} from 'apps/gitmoa/src/users/dto/getUserDayStats.dto';
import { FindUserMeOutput } from 'apps/gitmoa/src/users/dto/find-user-me.dto';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => FindUserByIdOutput)
  async findUserById(
    @Args() { id }: FindUserByIdInput,
    @AuthUser() authUser,
  ): Promise<FindUserByIdOutput> {
    console.log(authUser);
    return this.usersService.findUserById(id);
  }

  @Roles([AllowedRoles.Login])
  @Query(() => FindUserMeOutput)
  async findUserMe(@AuthUser() authUser): Promise<FindUserMeOutput> {
    console.log(authUser);
    return this.usersService.findUserMe(authUser.id);
  }

  // @Query(() => FindUsersByIdsOutput)
  // async findUsersByIds(
  //   @Args() { ids }: FindUsersByIdsInput,
  //   @AuthUser() authUser,
  // ): Promise<FindUsersByIdsOutput> {
  //   return this.usersService.findUsers(ids);
  // }
}

@Resolver(() => UserDayStats)
export class UserDayStatsResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => GetUserDayStatsOutput)
  async getUserDayStats(
    @Args('input') input: GetUserDayStatsInput,
  ): Promise<GetUserDayStatsOutput> {
    return this.usersService.getUserDayStats(input);
  }
}
