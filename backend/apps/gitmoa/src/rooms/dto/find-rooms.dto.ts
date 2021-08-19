import { Room } from '@lib/entity';
import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'apps/gitmoa/src/common/dtos/output.dto';

@InputType()
export class FindRoomsInput {}

@ObjectType()
export class FindRoomsOutput extends CoreOutput {
  @Field(() => [Room])
  rooms?: Room[];
}
