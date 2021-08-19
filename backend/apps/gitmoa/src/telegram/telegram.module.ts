import { Module } from '@nestjs/common';
import { RandomNumberScene } from 'apps/gitmoa/src/telegram/random-number.scenes';
import { TelegramService } from 'apps/gitmoa/src/telegram/telegram.service';
import { TelegramUpdate } from 'apps/gitmoa/src/telegram/telegram.update';

@Module({
  providers: [TelegramService, TelegramUpdate, RandomNumberScene],
})
export class TelegramModule {}
