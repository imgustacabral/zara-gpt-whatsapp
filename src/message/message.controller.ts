import { Body, Controller, Post } from '@nestjs/common';
import { CustomerService } from './customer/customer.service';
import { MessageDto } from './dto/message-dto';
import { MessageService } from './message.service';
import { TwilioService } from './twilio/twilio.service';

@Controller('message')
export class MessageController {
  constructor(
    private readonly messageService: MessageService,
    private readonly customerService: CustomerService,
    private readonly twilio: TwilioService,
  ) {}

  @Post()
  async message(@Body() messageDto: MessageDto) {
    const route = messageDto.Body.toLowerCase().split(' ')[0];
    const user = messageDto.From;
    const serverNumber = messageDto.To;
    const content = messageDto.Body;

    if (route === '/imagine') {
      return this.messageService.sendImageMessage(messageDto);
    }
    if (route === '/help') {
    }
    if (route === '/clear') {
      await this.customerService.clearHistory(user);
      return await this.twilio.createMessage(
        serverNumber,
        user,
        'Historico Limpo com sucesso, como posso te ajudar hoje?',
      );
    }

    const customer = await this.customerService.findCustomer(user);
    if (!customer) {
      await this.customerService.createCustomer({ user });
      await this.customerService.createMessage({
        role: 'user',
        content,
        owner: {
          connect: {
            user,
          },
        },
      });
      return this.messageService.sendMessage(messageDto);
    }

    await this.customerService.createMessage({
      role: 'user',
      content,
      owner: {
        connect: {
          user,
        },
      },
    });
    return this.messageService.sendMessage(messageDto);
  }
}
