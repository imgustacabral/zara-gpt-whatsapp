import { Module } from '@nestjs/common';
import { MessageController } from './message.controller';
import { OpenAiService } from './open-ai/open-ai.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CustomerService } from './customer/customer.service';
import { MessageService } from './message.service';
import { WhatsappService } from './whatsapp/whatsapp.service';

@Module({
  imports: [],
  controllers: [MessageController],
  providers: [
    PrismaService,
    OpenAiService,
    CustomerService,
    MessageService,
    WhatsappService,
  ],
})
export class MessageModule {}
