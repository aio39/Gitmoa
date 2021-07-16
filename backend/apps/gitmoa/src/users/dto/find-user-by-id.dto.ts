import { ArgsType, Field, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from '../../common/dtos/output.dto';
import { User } from '../entities/user.entity';

@ArgsType()
export class FindUserByIdInput {
  @Field((type) => Number)
  id: number;
}

@ObjectType()
export class FindUserByIdOutput extends CoreOutput {
  @Field((type) => User, { nullable: true })
  user?: User;
}
