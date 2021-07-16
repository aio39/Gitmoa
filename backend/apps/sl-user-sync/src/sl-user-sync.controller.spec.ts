import { Test, TestingModule } from '@nestjs/testing';
import { SlUserSyncController } from './sl-user-sync.controller';
import { SlUserSyncService } from './sl-user-sync.service';

describe('SlUserSyncController', () => {
  let slUserSyncController: SlUserSyncController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [SlUserSyncController],
      providers: [SlUserSyncService],
    }).compile();

    slUserSyncController = app.get<SlUserSyncController>(SlUserSyncController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(slUserSyncController.getHello()).toBe('Hello World!');
    });
  });
});
