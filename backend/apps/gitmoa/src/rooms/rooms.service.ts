import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { find } from 'rxjs';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { CreateRoomInput } from './dto/create-room.input';
import { DeleteRoomOutput } from './dto/delete-room.dto';
import { FindRoomByIdOutput } from './dto/find-room-by-id.dto';
import { ParticipateRoomOutput } from './dto/participate-room.dto';
import { UpdateRoomInput } from './dto/update-room.input';
import { Room } from './entities/room.entity';
import { Tag } from './entities/tag.entity';
import { TagRepository } from './repositories/tag.repository';

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
      const newRoom = this.rooms.create(createRoomInput);
      newRoom.creator = creator;
      const tagArray = await this.tags.getOrCreate(createRoomInput.tagNames);
      console.log(tagArray[0]);
      newRoom.tags = [...tagArray];
      console.log(newRoom);
      await this.rooms.save(newRoom);
      return {
        ok: true,
        roomId: newRoom.id,
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
  async findOneRoom() {
    try {
    } catch (error) {}
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
