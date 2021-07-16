import { Module } from '@nestjs/common';
import { SlUserSyncController } from './sl-user-sync.controller';
import { SlUserSyncService } from './sl-user-sync.service';

@Module({
  imports: [],
  controllers: [SlUserSyncController],
  providers: [SlUserSyncService],
})
export class SlUserSyncModule {}
