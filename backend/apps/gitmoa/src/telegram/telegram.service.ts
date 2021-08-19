import { Injectable } from '@nestjs/common';

@Injectable()
export class TelegramService {
  echo(text: string): string {
    return `Echo: ${text}`;
  }
}
