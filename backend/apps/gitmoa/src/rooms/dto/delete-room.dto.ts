import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'apps/gitmoa/src/common/dtos/output.dto';

@InputType()
export class DeleteRoomInput {
  @Field(() => Number)
  id: number;
}

@ObjectType()
export class DeleteRoomOutput extends CoreOutput {}
