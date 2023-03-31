import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Twilio } from 'twilio';
import { CreateMessageDto } from './dto/create-message.dto';

@Injectable()
export class TwilioService {
  private client: Twilio;
  constructor() {
    this.client = new Twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN,
    );
  }

  async createMessage(createMessageDto: CreateMessageDto) {
    let status = '';
    const { to, from, body, mediaUrl } = createMessageDto;
    if (!from || !to) {
      throw new HttpException(
        'You must provide from and to whatsapp numbers',
        HttpStatus.BAD_REQUEST,
      );
    }
    await this.client.messages
      .create({
        from: from,
        body,
        mediaUrl: [mediaUrl],
        to: to,
      })
      .then((msg) => {
        status = msg.status;
      });

    return status;
  }
}
