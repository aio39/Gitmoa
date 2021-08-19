import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Context } from 'apps/gitmoa/src/telegram/context.interface';
import { TelegrafExecutionContext, TelegrafException } from 'nestjs-telegraf';

@Injectable()
export class AdminGuard implements CanActivate {
  private readonly ADMIN_IDS = [];

  canActivate(context: ExecutionContext): boolean {
    const ctx = TelegrafExecutionContext.create(context);
    const { from } = ctx.getContext<Context>();

    const isAdmin = this.ADMIN_IDS.includes(from.id);
    if (!isAdmin) {
      throw new TelegrafException('You are not admin 😡');
    }

    return true;
  }
}
