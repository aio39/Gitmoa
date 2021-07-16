import {
  ArgsType,
  Int,
  Field,
  InputType,
  ObjectType,
  PickType,
} from '@nestjs/graphql';
import { IsBoolean, IsString, Length } from 'class-validator';
import { CoreOutput } from '../../common/dtos/output.dto';
import { Room } from '../entities/room.entity';

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
  @Field((type) => Int)
  roomId?: number;
}
