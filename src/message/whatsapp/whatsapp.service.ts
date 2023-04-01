import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';

@Injectable()
export class WhatsappService {
  apiUrl: string;
  constructor() {
    this.apiUrl = process.env.WHATSAPP_API_URL;
  }
  async createMessage(createMessageDto: CreateMessageDto) {
    await fetch('https://bfc6-170-84-145-250.sa.ngrok.io/message', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `number=${createMessageDto.to.split('@')[0]}&message=${createMessageDto.body}`,
    });
    console.log(createMessageDto.to);
    return createMessageDto;
  }
}
