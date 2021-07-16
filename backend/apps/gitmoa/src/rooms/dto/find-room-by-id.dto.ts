import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from '../../common/dtos/output.dto';
import { Room } from '../entities/room.entity';

@InputType()
export class FindRoomByIdInput extends PickType(Room, ['id']) {}

@ObjectType()
export class FindRoomByIdOutput extends CoreOutput {
  @Field(() => Room)
  room?: Room;
}
