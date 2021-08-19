import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FindUserByIdOutput } from './dto/find-user-by-id.dto';
import { User, UserDayStats } from '@lib/entity';
import {
  GetUserDayStatsInput,
  GetUserDayStatsOutput,
} from 'apps/gitmoa/src/users/dto/getUserDayStats.dto';
import { FindUserMeOutput } from 'apps/gitmoa/src/users/dto/find-user-me.dto';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    @InjectRepository(UserDayStats)
    private readonly userDayStats: Repository<UserDayStats>,
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

  async findUserMe(id: number): Promise<FindUserMeOutput> {
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

  async findSomeUser() {
    try {
    } catch (error) {}
  }

  async findUsers(ids: number[]) {
    try {
    } catch (error) {
      return {
        ok: false,
        error: 'Can not Found User',
      };
    }
  }

  // 통계 관련
  async getUserDayStats({
    userId,
    from,
    to,
  }: GetUserDayStatsInput): Promise<GetUserDayStatsOutput> {
    try {
      const data = await this.userDayStats
        .createQueryBuilder('stats')
        .where('stats.fk_user_id = :fk_user_id', { fk_user_id: userId })
        .andWhere('stats.date BETWEEN :from AND :to  ', { from, to })
        .getMany();
      console.log(data);

      return {
        ok: true,
        dayStats: data,
      };
    } catch (error) {
      return {
        ok: false,
        error: 'Can not Found User',
      };
    }
  }
}
