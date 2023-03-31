import { Test, TestingModule } from '@nestjs/testing';
import { TwilioService } from './twilio.service';
import dotenv from 'dotenv';

describe('TwilioService', () => {
  let service: TwilioService;
  beforeEach(async () => {
    dotenv.config({ path: '.env' });
    const module: TestingModule = await Test.createTestingModule({
      providers: [TwilioService],
    }).compile();

    service = module.get<TwilioService>(TwilioService);
  });

  it('should send message with mediaURL', async () => {
    const content = {
      from: process.env.TWILIO_WHATSAPP_NUMBER,
      to: 'whatsapp:+5586981189181',
      body: 'Hello Test',
      mediaUrl:
        'https://cdn.pixabay.com/photo/2023/03/21/09/53/willow-catkin-7866866_960_720.jpg',
    };
    const result = await service.createMessage(content);
    expect(result).toBe('queued');
  });
  it('should send message without mediaURL', async () => {
    const content = {
      from: process.env.TWILIO_WHATSAPP_NUMBER,
      to: 'whatsapp:+558681189181',
      body: 'Hello Test',
    };
    const result = await service.createMessage(content);

    expect(result).toBe('queued');
  });
});
