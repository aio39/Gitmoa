import { Room } from '@lib/entity';
import { InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'apps/gitmoa/src/common/dtos/output.dto';

@InputType()
export class ParticipateRoomInput extends PickType(Room, ['id']) {}

@ObjectType()
export class ParticipateRoomOutput extends CoreOutput {}
