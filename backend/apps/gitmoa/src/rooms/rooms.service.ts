import { FindRoomsOutput } from './dto/find-rooms.dto';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createQueryBuilder, Repository } from 'typeorm';
import { CreateRoomInput } from './dto/create-room.input';
import { DeleteRoomOutput } from './dto/delete-room.dto';
import { FindRoomByIdOutput } from './dto/find-room-by-id.dto';
import { ParticipateRoomOutput } from './dto/participate-room.dto';
import { User, TagRepository, Room, EntityName, Tag } from '@lib/entity';
@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(Room)
    private readonly rooms: Repository<Room>,
    @InjectRepository(User)
    private readonly users: Repository<User>,
    @InjectRepository(TagRepository)
    private readonly tags: TagRepository,
  ) {}

  async createRoom(creator: User, createRoomInput: CreateRoomInput) {
    try {
      const { isSecret } = createRoomInput;
      const newRoom = this.rooms.create(createRoomInput);
      newRoom.creator = creator;
      const tagArray = await this.tags.getOrCreate(createRoomInput.tags);
      console.log(tagArray[0]);
      newRoom.tags = [...tagArray];
      console.log(newRoom);
      const createdRoom = await this.rooms.save(newRoom);
      return {
        ok: true,
        roomId: createdRoom.id,
        ...(isSecret && { secretLink: createdRoom.secretLink }),
      };
    } catch (error) {
      console.log(error);
      console.table(error);
      return {
        ok: false,
        error: 'Could not create room',
      };
    }
  }

  async updateRoomProfile() {
    try {
    } catch (error) {}
  }

  async deleteRoom(roomId: number): Promise<DeleteRoomOutput> {
    try {
      return {
        ok: true,
      };
    } catch (error) {
      return {
        ok: false,
        error: 'Could not delete room',
      };
    }
  }

  async participateRoom(
    userId: number,
    roomId: number,
  ): Promise<ParticipateRoomOutput> {
    try {
      const [finedRoom, finedUser] = await Promise.all([
        this.rooms.findOne(roomId, { relations: ['creator'] }),
        this.users.findOne(userId),
      ]);

      if (!finedRoom) {
        return {
          ok: false,
          error: 'Could not find room',
        };
      }
      if (!finedUser) {
        return {
          ok: false,
          error: 'Could not find user',
        };
      }
      if (finedRoom.creator.id === finedUser.id) {
        return {
          ok: false,
          error: "Room's creator can't not be participants ",
        };
      }
      await this.rooms
        .createQueryBuilder()
        .relation('participants')
        .of(finedRoom)
        .add(finedUser);
      return {
        ok: true,
      };
    } catch (error) {
      console.log(error);
      return {
        ok: false,
        error: 'Could not participate to Room',
      };
    }
  }

  // async findParticipants(roomId: number) {
  //   try {
  //     const users = await createQueryBuilder(EntityName.User, 'user')
  //       .leftJoin('participant_of_room', 'pr', 'pr.userId = user.id')
  //       .where('pr.roomId = :roomId', { roomId })
  //       .getMany();
  //     return users;
  //   } catch (error) {
  //     console.log(error);
  //     throw new InternalServerErrorException();
  //   }
  // }

  async findParticipants(roomId: number) {
    try {
      const users = await createQueryBuilder(EntityName.User, 'user')
        .leftJoin('participant_of_room', 'pr', 'pr.userId = user.id')
        .where('pr.roomId = :roomId', { roomId })
        .getMany();
      return users;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async findTags(roomId: number): Promise<Tag[]> {
    try {
      const tags = await createQueryBuilder<Tag>(EntityName.Tag, 'tag')
        .leftJoin('tag_of_room', 'tr', 'tr.tagId = tag.id')
        .where('tr.roomId = :roomId', { roomId })
        .getMany();
      return tags;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  // 회원 방에서 강퇴
  async withdrawParticipants() {
    try {
    } catch (error) {}
  }

  async acceptsParticipate() {
    try {
    } catch (error) {}
  }

  async addTagToRoom() {
    try {
    } catch (error) {}
  }

  async deleteTagToRoom() {
    try {
    } catch (error) {}
  }

  // 참가 전
  async findOneRoom(id): Promise<FindRoomByIdOutput> {
    try {
      const room = await this.rooms.findOne(id);
      return {
        ok: true,
        room: room,
      };
    } catch (error) {
      return {
        ok: false,
        error: 'Could not find Room ',
      };
    }
  }

  async findRoomsByIds(ids: readonly number[]) {
    return this.rooms.findByIds(ids as number[]);
  }

  async findRooms(): Promise<FindRoomsOutput> {
    try {
      const rooms = await this.rooms.find({ take: 10 });

      return {
        rooms,
        ok: true,
      };
    } catch (error) {
      return {
        ok: false,
        error: 'Rooms Not Found',
      };
    }
  }

  async findRoomById(id: number): Promise<FindRoomByIdOutput> {
    try {
      const room = await this.rooms.findOne(id);
      return {
        ok: true,
        room,
      };
    } catch (error) {
      return {
        ok: false,
        error: 'Room Not Found',
      };
    }
  }

  //  참가 후, 참가 여부 확인
  async findOneRoomDetail() {
    try {
    } catch (error) {}
  }

  // Option isMyRoom, Room Count, isOwner
  async findSomeRoom() {
    try {
    } catch (error) {}
  }
}
