import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { RoomsService } from './rooms.service';
// import { Room } from './entities/room.entity';
import { CreateRoomInput, CreateRoomOutput } from './dto/create-room.input';
import {
  ParticipateRoomInput,
  ParticipateRoomOutput,
} from './dto/participate-room.dto';
import { DeleteRoomInput, DeleteRoomOutput } from './dto/delete-room.dto';
import { AuthUser } from '../auth/auth-decorator/auth-user.decorator';
// import { User } from '../users/entities/user.entity';
import { AllowedRoles, Roles } from '../auth/auth-decorator/roles.decorator';
import { User, Room } from '@lib/entity';
@Resolver(() => Room)
export class RoomsResolver {
  constructor(private readonly roomsService: RoomsService) {}

  @Mutation(() => CreateRoomOutput)
  async createRoom(
    @AuthUser() authUser: User,
    @Args('input') createRoomInput: CreateRoomInput,
  ): Promise<CreateRoomOutput> {
    return this.roomsService.createRoom(authUser, createRoomInput);
  }

  // @Mutation(( ))
  // async updateRoomProfile(): Promise<>

  @Mutation(() => DeleteRoomOutput)
  @Roles([AllowedRoles.Creator])
  async deleteRoom(
    @Args('input') { id: roomId }: DeleteRoomInput,
  ): Promise<DeleteRoomOutput> {
    return this.roomsService.deleteRoom(roomId);
  }

  @Mutation(() => ParticipateRoomOutput)
  async participateRoom(
    @Args('input') { id: roomId }: ParticipateRoomInput,
    @AuthUser() { id: userId }: User,
  ): Promise<ParticipateRoomOutput> {
    return this.roomsService.participateRoom(userId, roomId);
  }
}
