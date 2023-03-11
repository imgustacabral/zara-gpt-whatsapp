import { Injectable } from '@nestjs/common';
import { CustomerService } from './customer/customer.service';
import { MessageDto } from './dto/message-dto';
import { OpenAiService } from './open-ai/open-ai.service';
import { TwilioService } from './twilio/twilio.service';

@Injectable()
export class MessageService {
  constructor(
    private readonly openAiService: OpenAiService,
    private readonly twilioService: TwilioService,
    private readonly customerService: CustomerService,
  ) {}
  async sendMessage(messageDto: MessageDto) {
    function sleep(ms: number) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    }
    const clientId = messageDto.From;
    const serverId = messageDto.To;
    const content = messageDto.Body;

    const context = await this.customerService.getMessagesContext(clientId);
    const response = await this.openAiService.createChatCompletition(
      clientId,
      context,
      content,
    );
    if (!response) {
      return await this.twilioService.createMessage(
        serverId,
        clientId,
        'Serviço indisponível no momento. Por favor, tente novamente mais tarde.',
      );
    }
    await this.customerService.createMessage({
      role: 'assistant',
      content: response,
      owner: {
        connect: {
          user: clientId,
        },
      },
    });
    try {
      if (response.length > 1400) {
        const chunks = response.match(/.{1,1400}/g);
        console.log(chunks.length);
        chunks.forEach(async (chunk) => {
          await sleep(3000);
          await this.twilioService.createMessage(serverId, clientId, chunk);
        });
      } else {
        await this.twilioService.createMessage(serverId, clientId, response);
      }
    } catch (e) {
      console.log(e);
    }
  }

  async sendImageMessage(messageDto: MessageDto) {
    const clientId = messageDto.From;
    const serverId = messageDto.To;
    const prompt = messageDto.Body.substring(9);
    const imgURL = await this.openAiService.createImage(prompt);
    if (imgURL === 400) {
      return await this.twilioService.createMessage(
        serverId,
        clientId,
        'Peço desculpas, mas não sou capaz de gerar essa imagem no momento.',
      );
    }
    return await this.twilioService.createMessage(
      serverId,
      clientId,
      prompt,
      imgURL,
    );
  }
}
