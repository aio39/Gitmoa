import { InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dto';
import { Room } from '../entities/room.entity';

@InputType()
export class ParticipateRoomInput extends PickType(Room, ['id']) {}

@ObjectType()
export class ParticipateRoomOutput extends CoreOutput {}
