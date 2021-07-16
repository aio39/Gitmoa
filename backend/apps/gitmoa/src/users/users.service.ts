import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserInput } from './dto/create-user.input';
import { FindUserByIdOutput } from './dto/find-user-by-id.dto';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
  ) {}

  async syncUserMeDataWithGithub() {
    try {
    } catch (error) {}
  }

  async updateUserMeProfile() {
    try {
    } catch (error) {}
  }

  async removeUserMe() {
    try {
    } catch (error) {}
  }

  async findUserById(id: number): Promise<FindUserByIdOutput> {
    try {
      const user = await this.users.findOne(id);
      if (!user)
        return {
          ok: false,
          error: 'User not Found',
        };
      return {
        ok: true,
        user: user,
      };
    } catch (error) {
      return {
        ok: false,
        error: 'User Not Found',
      };
    }
  }

  async findUserMe() {
    try {
    } catch (error) {}
  }

  async findSomeUser() {
    try {
    } catch (error) {}
  }
}
