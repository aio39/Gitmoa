import { UseFilters, UseGuards, UseInterceptors } from '@nestjs/common';
import {
  Help,
  InjectBot,
  On,
  Message,
  Start,
  Update,
  Command,
} from 'nestjs-telegraf';
import { Telegraf } from 'telegraf';
import { TelegramService } from 'apps/gitmoa/src/telegram/telegram.service';
import { Context } from 'apps/gitmoa/src/telegram/context.interface';
import { GitmoaBotName } from 'apps/gitmoa/src/app.constants,';
import { ResponseTimeInterceptor } from 'apps/gitmoa/src/telegram/response-time.interceptor';
import { TelegrafExceptionFilter } from 'apps/gitmoa/src/telegram/telegrag-exception.filter';
import { AdminGuard } from 'apps/gitmoa/src/telegram/admin.guard';
import { ReverseTextPipe } from 'apps/gitmoa/src/telegram/reverse-text.pipe';

@Update()
@UseInterceptors(ResponseTimeInterceptor)
@UseFilters(TelegrafExceptionFilter)
export class TelegramUpdate {
  constructor(
    @InjectBot() private readonly bot: Telegraf<Context>,
    private readonly telegramService: TelegramService,
  ) {}

  @Start()
  async onStart(): Promise<string> {
    const me = await this.bot.telegram.getMe();
    return `Hey, I'm ${me.first_name}`;
  }

  @Help()
  async onHelp(): Promise<string> {
    return 'Send me any text';
  }

  @Command('admin')
  @UseGuards(AdminGuard)
  onAdminCommand(): string {
    return 'Welcome judge';
  }

  @On('text')
  onMessage(
    @Message('text', new ReverseTextPipe()) reversedText: string,
  ): string {
    return this.telegramService.echo(reversedText);
  }
}
