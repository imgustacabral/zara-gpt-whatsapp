import { Test, TestingModule } from '@nestjs/testing';
import { MessageService } from './message.service';
import { PrismaService } from '../prisma/prisma.service';
import { CustomerService } from './customer/customer.service';
import { OpenAiService } from './open-ai/open-ai.service';
import { TwilioService } from './twilio/twilio.service';
import dotenv from 'dotenv';

describe('MessageService', () => {
  let service: MessageService;

  beforeEach(async () => {
    dotenv.config({ path: '.env' });
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PrismaService,
        OpenAiService,
        TwilioService,
        CustomerService,
        MessageService,
      ],
    }).compile();

    service = module.get<MessageService>(MessageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
