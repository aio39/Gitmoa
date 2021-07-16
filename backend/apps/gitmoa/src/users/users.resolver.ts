import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import {
  FindUserByIdInput,
  FindUserByIdOutput,
} from './dto/find-user-by-id.dto';
import { AuthUser } from '../auth/auth-decorator/auth-user.decorator';

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
