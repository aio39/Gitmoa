import { Room, User, UserContribution, UserDayStats } from '@lib/entity';
import { Controller } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TestService } from './test.service';
const lambdaVar = {
  user: 'aio39',
};

@Controller('test')
export class TestController {
  constructor(
    private readonly testService: TestService,
    @InjectRepository(User) private readonly users: Repository<User>,
    @InjectRepository(UserContribution)
    private readonly userContributions: Repository<UserContribution>,
    @InjectRepository(UserDayStats)
    private readonly userDayStats: Repository<UserDayStats>,
    @InjectRepository(Room)
    private readonly rooms: Repository<Room>,
  ) {}
}
