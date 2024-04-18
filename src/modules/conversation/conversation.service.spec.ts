import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../app.module';
import { UserService } from '../user/user.service';
import { ConversationRepository } from './conversation.repository';
import { ConversationService } from './conversation.service';

describe('ConversationService', () => {
  let conversationRepository: ConversationRepository;
  let conversationService: ConversationService;
  let userService: UserService;
  let moduleRef: TestingModule;

  beforeAll(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    conversationRepository = moduleRef.get<ConversationRepository>(ConversationRepository);
    userService = moduleRef.get<UserService>(UserService);
    conversationService = moduleRef.get<ConversationService>(ConversationService);
  });

  afterAll(async () => {
    await moduleRef.close();
  });

  describe('#getListByUserId', () => {
    describe('when no conversations', () => {
      it('should return empty array', async () => {
        const id = 14;
        const questions = await conversationService.list(id);

        expect(questions).toEqual([]);
      });
    });

    describe('when conversations', () => {
      it('should return list of  conversations', async () => {

      });
    });
  });
});
