import { Test, TestingModule } from '@nestjs/testing';
import { OpenAiService } from './open-ai.service';
import { ChatCompletionRequestMessage } from 'openai';
import dotenv from 'dotenv';

describe('OpenAiService', () => {
  let service: OpenAiService;
  beforeEach(async () => {
    dotenv.config({ path: '.env' });
    const module: TestingModule = await Test.createTestingModule({
      providers: [OpenAiService],
    }).compile();

    service = module.get<OpenAiService>(OpenAiService);
  });

  it('should create chat completition', async () => {
    const context: ChatCompletionRequestMessage[] = [];
    context.push({ role: 'system', content: '' });

    const response = await service.createChatCompletition(
      'test_user',
      context,
      'Hello',
    );

    expect(response).toBeTruthy();
  });

  it('should create a image with prompt', async () => {
    const response = await service.createImage('Draw a Software engineer');

    expect(response).toBeTruthy();
  }, 30000);

  it('should throw error for create a image with illegal prompt', async () => {
    const response = await service.createImage('Draw donald trump');

    expect(response).toBe(400);
  }, 30000);
});
