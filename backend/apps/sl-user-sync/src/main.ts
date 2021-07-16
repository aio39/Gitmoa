import { NestFactory } from '@nestjs/core';
import { SlUserSyncModule } from './sl-user-sync.module';

async function bootstrap() {
  const app = await NestFactory.create(SlUserSyncModule);
  await app.listen(3000);
}
bootstrap();
