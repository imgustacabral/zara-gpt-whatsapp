/* eslint-disable @typescript-eslint/ban-types */
import { Injectable } from '@nestjs/common';
import { MessageService } from '../message.service';
import { Client, LocalAuth, MessageMedia } from 'whatsapp-web.js';
import * as qrcode from 'qrcode';
import { ReplyMessageDto } from '../dto/reply-message.dto';
import { getCannotGenerateImageError } from '../helpers/error-messages';

@Injectable()
export class RouterService {
  client: Client;
  commands: Map<string, Function>;

  constructor(private readonly messageService: MessageService) {
    this.client = new Client({
      authStrategy: new LocalAuth({ clientId: 'zara-bot' }),
      puppeteer: {
        headless: true,
        args: ['--no-sandbox'],
      },
    });

    this.commands = new Map<string, Function>();
    this.commands.set('/imagine', this.handleImagineCommand.bind(this));
    this.commands.set('/clear', this.handleClearCommand.bind(this));
    this.commands.set('contribuir', this.handleDonateCommand.bind(this));
    this.commands.set('/doar', this.handleDonateCommand.bind(this));
    this.commands.set('/donate', this.handleDonateCommand.bind(this));
    this.commands.set('doar', this.handleDonateCommand.bind(this));
    this.commands.set('/help', this.handleHelpCommand.bind(this));
    this.commands.set('ajuda', this.handleHelpCommand.bind(this));
    this.commands.set('/suporte', this.handleSuporterHelperCommand.bind(this));
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

      const handler = this.commands.get(command);
      if (handler) {
        return await handler(msg, to);
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

  async handleImagineCommand(msg, to) {
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

  async handleClearCommand(msg, to) {
    return await this.reply({
      body: await this.messageService.clearMessageHistory(msg.from),
      to: msg.from,
    });
  }

  async handleDonateCommand(msg, to) {
    return await this.reply({
      to,
      body: await this.messageService.donationMessage(),
    });
  }

  async handleHelpCommand(msg, to) {
    return await this.reply({
      to,
      body: await this.messageService.helpMessage(),
    });
  }

  async handleSuporterHelperCommand(msg, to) {
    return await this.reply({
      to,
      body: await this.messageService.HelperSuporterMessage(),
    });
  }
}
