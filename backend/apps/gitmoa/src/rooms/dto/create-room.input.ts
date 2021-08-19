import { Room, Tag } from '@lib/entity';
import { Int, Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'apps/gitmoa/src/common/dtos/output.dto';

@InputType()
class TagInput extends PickType(Tag, ['name', 'icon']) {}

@InputType()
export class CreateRoomInput extends PickType(Room, [
  'name',
  'description',
  'isSecret',
  'isCanSearched',
  'password',
  'maxNum',
]) {
  @Field(() => [TagInput], { nullable: true })
  tags?: TagInput[];
}

@ObjectType()
export class CreateRoomOutput extends CoreOutput {
  @Field(() => Int)
  roomId?: number;

  @Field(() => String)
  secretLink?: string;
}
