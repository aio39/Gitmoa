import { User, UserDayStats } from '@lib/entity';
import { ArgsType, Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from '../../common/dtos/output.dto';

@InputType()
export class GetUserDayStatsInput {
  @Field(() => Int, { description: 'userId' })
  userId: number;

  @Field(() => String, { description: 'Start String' })
  from: string;

  @Field(() => String, { description: 'End Date ' })
  to: string;
}

@ObjectType()
export class GetUserDayStatsOutput extends CoreOutput {
  @Field(() => [UserDayStats], { nullable: true })
  dayStats?: UserDayStats[];
}
