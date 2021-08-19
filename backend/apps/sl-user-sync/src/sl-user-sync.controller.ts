import { Controller, Get } from '@nestjs/common';
import { SlUserSyncService } from './sl-user-sync.service';

@Controller()
export class SlUserSyncController {
  constructor(private readonly slUserSyncService: SlUserSyncService) {}
}
