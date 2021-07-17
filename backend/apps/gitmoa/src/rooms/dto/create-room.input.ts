import { Room } from '@lib/entity';
import { Int, Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'apps/gitmoa/src/common/dtos/output.dto';

@InputType()
export class CreateRoomInput extends PickType(Room, [
  'name',
  'description',
  'isSecret',
  'isCanSearched',
  'password',
]) {
  @Field(() => [String])
  tagNames: string[];
}

@ObjectType()
export class CreateRoomOutput extends CoreOutput {
  @Field(() => Int)
  roomId?: number;
}
