import { Injectable } from '@nestjs/common';
import { MessageService } from '../message.service';
import { Client, LocalAuth, MessageMedia } from 'whatsapp-web.js';
import * as qrcode from 'qrcode';
import { ReplyMessageDto } from '../dto/reply-message.dto';
import { getCannotGenerateImageError } from '../helpers/error-messages';

@Injectable()
export class RouterService {
  client: Client;
  constructor(private readonly messageService: MessageService) {
    this.client = new Client({
      authStrategy: new LocalAuth({ clientId: 'zara-bot' }),
      puppeteer: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      },
    });
  }

  initialize(): void {
    this.client.on('qr', (qr) => {
      console.log('QR Generated');
      qrcode.toString(
        qr,
        { type: 'terminal', small: true },
        function (err, url) {
          if (err) throw err;
          console.log(url);
        },
      );
    });

    this.client.on('ready', () => {
      console.log('Server is running!');
    });

    this.client.on('message', async (msg) => {
      const command = msg.body.toLowerCase().split(' ')[0];
      const to = msg.from;
      const isGroupMessage = msg.from.split('@')[1] === 'g.us';
      console.log(isGroupMessage);
      console.log(command);
      if (command === '/imagine') {
        const createdImage = await this.messageService.createImage(msg.body);
        if (createdImage === 400) {
          return await this.reply({
            to,
            body: getCannotGenerateImageError(),
          });
        }
        return await this.replyImage({
          to,
          body: createdImage,
        });
      }

      if (command === '/clear') {
        return await this.reply({
          body: await this.messageService.clearMessageHistory(msg.from),
          to: msg.from,
        });
      }

      if (
        command === 'contribuir' ||
        command === '/doar' ||
        command === '/donate' ||
        command === 'doar'
      ) {
        return await this.reply({
          to,
          body: await this.messageService.donationMessage(),
        });
      }

      if (command === '/help' || command === 'ajuda') {
        return await this.reply({
          to,
          body: await this.messageService.helpMessage(),
        });
      }
      if (isGroupMessage && command !== 'zara') {
        return;
      }

      const response = await this.messageService.createMessage({
        from: msg.from,
        body: msg.body,
      });
      try {
        if (response.length > 1400) {
          const chunks = response.match(/.{1,1400}/g);
          chunks.forEach(async (chunk: string) => {
            await this.reply({
              to,
              body: chunk,
            });
          });
        } else {
          await this.reply({
            to,
            body: response,
          });
        }
      } catch (e) {
        console.log(e);
      }
    });

    this.client.initialize();
  }

  async reply(replyMessageDto: ReplyMessageDto) {
    return await this.client.sendMessage(
      replyMessageDto.to,
      replyMessageDto.body,
    );
  }

  async replyImage(replyMessageDto: ReplyMessageDto) {
    const media = await MessageMedia.fromUrl(replyMessageDto.body);

    return await this.client.sendMessage(replyMessageDto.to, media);
  }
}
