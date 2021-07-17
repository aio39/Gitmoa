import { User } from '@lib/entity';
import { ArgsType, Field, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from '../../common/dtos/output.dto';

@ArgsType()
export class FindUserByIdInput {
  @Field(() => Number)
  id: number;
}

@ObjectType()
export class FindUserByIdOutput extends CoreOutput {
  @Field(() => User, { nullable: true })
  user?: User;
}
