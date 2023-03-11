import { Module } from '@nestjs/common';
import { MessageController } from './message.controller';
import { OpenAiService } from './open-ai/open-ai.service';
import { TwilioService } from './twilio/twilio.service';
import { MessageService } from './message.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CustomerService } from './customer/customer.service';

@Module({
  imports: [],
  controllers: [MessageController],
  providers: [
    PrismaService,
    OpenAiService,
    TwilioService,
    MessageService,
    CustomerService,
  ],
})
export class MessageModule {}
