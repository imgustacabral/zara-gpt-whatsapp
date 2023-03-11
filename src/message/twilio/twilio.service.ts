import { Injectable } from '@nestjs/common';
import { Twilio } from 'twilio';

@Injectable()
export class TwilioService {
  private accountSid: string;
  private authToken: string;
  private client: Twilio;
  constructor() {
    this.accountSid = process.env.TWILIO_ACCOUNT_SID;
    this.authToken = process.env.TWILIO_AUTH_TOKEN;
    this.client = new Twilio(this.accountSid, this.authToken);
  }

  async createMessage(
    from: string,
    to: string,
    body: string,
    mediaUrl?: string,
  ) {
    await this.client.messages
      .create({
        from,
        body,
        mediaUrl: [mediaUrl],
        to,
      })
      .then((msg) => {
        return msg.sid;
      });
  }
}
