import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { MessageDto } from './dto/message-dto';
import { MessageService } from './message.service';

@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post()
  @HttpCode(200)
  async message(@Body() messageDto: MessageDto) {
    const command = messageDto.Body.toLowerCase().split(' ')[0];

    if (command === '/imagine') {
      return await this.messageService.sendImageMessage(messageDto);
    }
    if (command === '/clear') {
      return await this.messageService.clearMessageHistory(messageDto);
    }
    if (command === '/help' || command[0] === '/') {
      return await this.messageService.sendHelpMessage(messageDto);
    }
    return await this.messageService.sendMessage(messageDto);
  }
}
