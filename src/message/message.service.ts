import { Injectable } from '@nestjs/common';
import { CustomerService } from './customer/customer.service';
import { MessageDto } from './dto/message-dto';
import { OpenAiService } from './open-ai/open-ai.service';
import { WhatsappService } from './whatsapp/whatsapp.service';


@Injectable()
export class MessageService {
  constructor(
    private readonly whatsappService: WhatsappService,
    private readonly openAiService: OpenAiService,
    private readonly customerService: CustomerService,
  ) {}
  async sendMessage(messageDto: MessageDto) {
    const user = messageDto.From;
    const content = messageDto.Body;
    const customer = await this.customerService.findCustomer(user);

    if (!customer) {
      await this.customerService.createCustomer({ user });
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

    await this.customerService.saveMessage({
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

    const context = await this.customerService.getMessagesContext(clientId);
    const response = await this.openAiService.createChatCompletition(
      clientId,
      context,
      content,
    );
    if (response === 400) {
      this.customerService.clearHistory(clientId);
      return this.sendMessage(messageDto);
    }
    if (!response || response === 429) {
      const content = {
        to: clientId,
        body: 'Serviço indisponível no momento. Por favor, tente novamente mais tarde.',
      };
      return await this.whatsappService.createMessage(content);
    }

    await this.customerService.saveMessage({
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
         return await this.whatsappService.createMessage({
            to: clientId,
            body: chunk,
          });
        });
      } else {
       return await this.whatsappService.createMessage({
          to: clientId,
          body: response,
        });
      }
    } catch (e) {
      console.log(e);
    }
  }

  async sendImageMessage(messageDto: MessageDto) {
    const clientId = messageDto.From;
    const prompt = messageDto.Body.substring(9);
    const createdImage = await this.openAiService.createImage(prompt);

    const content = {
      to: clientId,
      body: 'Peço desculpas, mas não sou capaz de gerar essa imagem no momento.',
      imgUrl: '',
    };

    if (createdImage === 400) {
      return await this.whatsappService.createMessage(content);
    }
    content.body = prompt;
    content.imgUrl = createdImage;
    return await this.whatsappService.createMessage(content);
  }

  async sendHelpMessage(messageDto: MessageDto) {
    const content = {
      to: messageDto.From,
      body: `  🤖 Bem-vindo ao ChatGPT! Eu sou o seu assistente virtual. Aqui estão as funcionalidades disponíveis:

    💬 Conversação: Você pode conversar comigo usando todo o poder do ChatGPT. Basta me enviar uma mensagem!
    
    🎨 Geração de imagens: Você também pode gerar imagens incríveis usando o comando /imagine e fornecendo um prompt.

    🗑 Limpeza de histórico: Se quiser limpar o histórico de mensagens armazenado em nosso banco de dados, é só usar o comando /clear.
    
    👀 Ah, e não se preocupe! Todas as informações compartilhadas são mantidas em sigilo e seguimos as políticas de privacidade da OpenAI e Twilio.
    
    👋 Se precisar de ajuda em algum momento, é só chamar! Estou aqui para ajudá-lo.`,
    };

    return await this.whatsappService.createMessage(content);
  }

  async clearMessageHistory(messageDto: MessageDto) {
    const content = {
      to: messageDto.From,
      body: 'Histórico limpo com sucesso, como posso te ajudar hoje?',
    };

    await this.customerService.clearHistory(messageDto.From);
    return await this.whatsappService.createMessage(content);
  }
}
