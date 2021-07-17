import { Resolver, Query, Args } from '@nestjs/graphql';
import { UsersService } from './users.service';
import {
  FindUserByIdInput,
  FindUserByIdOutput,
} from './dto/find-user-by-id.dto';
import { AuthUser } from '../auth/auth-decorator/auth-user.decorator';
import { User } from '@lib/entity';

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
}
