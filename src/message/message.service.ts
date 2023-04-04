import { Injectable } from '@nestjs/common';
import { CustomerService } from './customer/customer.service';
import { IncomingMessageDto } from './dto/incoming-message.dto.';
import { OpenAiService } from './open-ai/open-ai.service';
import { Client } from 'whatsapp-web.js';
import {
  getHelpMessage,
  getThankYouMessage,
  getDonationMessage,
  getClearChatSuccessMessage,
  getHelperSuporterMessage,
} from './helpers/chat-messages';
import { getServiceUnavailableError } from './helpers/error-messages';

@Injectable()
export class MessageService {
  client: Client;
  constructor(
    private readonly openAiService: OpenAiService,
    private readonly customerService: CustomerService,
  ) {}

  async createMessage(incomingMessageDto: IncomingMessageDto) {
    const user = incomingMessageDto.from;
    const content = incomingMessageDto.body;
    const customer = await this.customerService.findCustomer(user);

    if (!customer) {
      const createdCustomer = await this.customerService.createCustomer({
        user,
      });
      if (createdCustomer) {
        await this.customerService.saveMessage({
          role: 'system',
          content: process.env.BOT_PERSONA,
          owner: {
            connect: {
              user,
            },
          },
        });
        await this.customerService.saveMessage({
          role: 'user',
          content,
          owner: {
            connect: {
              user,
            },
          },
        });
      }

      return getDonationMessage();
    }

    await this.customerService.saveMessage({
      role: 'user',
      content,
      owner: {
        connect: {
          user,
        },
      },
    });

    const context = await this.customerService.getMessagesContext(user);
    const response = await this.openAiService.createChatCompletition(
      user,
      context,
      content,
    );
    if (response === 400) {
      this.customerService.clearHistory(user);
      return getServiceUnavailableError();
    }
    if (!response || response === 429) {
      return getServiceUnavailableError;
    }

    await this.customerService.saveMessage({
      role: 'assistant',
      content: response,
      owner: {
        connect: {
          user: user,
        },
      },
    });
    return response;
  }

  async createImage(prompt: string) {
    const createdImage = await this.openAiService.createImage(
      prompt.substring(9),
    );
    return createdImage;
  }

  async helpMessage() {
    return getHelpMessage();
  }

  async clearMessageHistory(user: string) {
    await this.customerService.clearHistory(user);
    return getClearChatSuccessMessage();
  }

  async donationMessage() {
    return getThankYouMessage();
  }

  async HelperSuporterMessage() {
    return getHelperSuporterMessage();
  }
}
