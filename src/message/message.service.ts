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
    const user = messageDto.From;
    const content = messageDto.Body;
    const customer = await this.customerService.findCustomer(user);
    if (!customer) {
      await this.customerService.createCustomer({ user });
      await this.customerService.createMessage({
        role: 'system',
        content: process.env.BOT_PERSONA,
        owner: {
          connect: {
            user,
          },
        },
      });
      await this.customerService.createMessage({
        role: 'user',
        content,
        owner: {
          connect: {
            user,
          },
        },
      });
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
    function sleep(ms: number) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    }
    const clientId = messageDto.From;
    const serverId = messageDto.To;

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
          await this.twilioService.createMessage(serverId, clientId, chunk);
          await sleep(3000);
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

  async sendHelpMessage(messageDto: MessageDto) {
    return await this.twilioService.createMessage(
      messageDto.To,
      messageDto.From,
      `  🤖 Bem-vindo ao ChatGPT! Eu sou o seu assistente virtual. Aqui estão as funcionalidades disponíveis:

    💬 Conversação: Você pode conversar comigo usando todo o poder do ChatGPT. Basta me enviar uma mensagem!
    
    🎨 Geração de imagens: Você também pode gerar imagens incríveis usando o comando /imagine e fornecendo um prompt.

    🗑 Limpeza de histórico: Se quiser limpar o histórico de mensagens armazenado em nosso banco de dados, é só usar o comando /clear.
    
    👀 Ah, e não se preocupe! Todas as informações compartilhadas são mantidas em sigilo e seguimos as políticas de privacidade da OpenAI e Twilio.
    
    👋 Se precisar de ajuda em algum momento, é só chamar! Estou aqui para ajudá-lo.`,
    );
  }

  async clearMessageHistory(messageDto: MessageDto) {
    await this.customerService.clearHistory(messageDto.From);
    return await this.twilioService.createMessage(
      messageDto.To,
      messageDto.From,
      'Histórico limpo com sucesso, como posso te ajudar hoje?',
    );
  }
}
