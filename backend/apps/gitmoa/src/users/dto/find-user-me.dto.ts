import { User } from '@lib/entity';
import { ArgsType, Field, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from '../../common/dtos/output.dto';

@ObjectType()
export class FindUserMeOutput extends CoreOutput {
  @Field(() => User, { nullable: true })
  user?: User;
}
