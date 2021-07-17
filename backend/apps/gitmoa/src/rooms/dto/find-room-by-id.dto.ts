import { Room } from '@lib/entity';
import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'apps/gitmoa/src/common/dtos/output.dto';

@InputType()
export class FindRoomByIdInput extends PickType(Room, ['id']) {}

@ObjectType()
export class FindRoomByIdOutput extends CoreOutput {
  @Field(() => Room)
  room?: Room;
}
