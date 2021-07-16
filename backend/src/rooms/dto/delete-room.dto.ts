import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Room } from '../entities/room.entity';

@InputType()
export class DeleteRoomInput {
  @Field((type) => Number)
  id: number;
}

@ObjectType()
export class DeleteRoomOutput extends CoreOutput {}
