import { Injectable } from '@nestjs/common';
import { CustomerService } from './customer/customer.service';
import { MessageDto } from './dto/message-dto';
import { OpenAiService } from './open-ai/open-ai.service';
import { Buttons, Client, LocalAuth } from 'whatsapp-web.js';
import { CreateMessageDto } from './whatsapp/dto/create-message.dto';
import * as qrcode from 'qrcode';

@Injectable()
export class MessageService {
  client: Client;
  constructor(
    private readonly openAiService: OpenAiService,
    private readonly customerService: CustomerService,
  ) {
    this.client = new Client({
      authStrategy: new LocalAuth({ clientId: 'bot-zdg' }),
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
        { type: 'terminal', small: true, scale: 0.5 },
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
      console.log(msg.body);
      console.log(msg.from);
      const command = msg.body.toLowerCase().split(' ')[0];

      if (command === '/imagine') {
        return await this.sendHelpMessage({ Body: msg.body, From: msg.from });
      }
      if (command === '/clear') {
        return await this.clearMessageHistory({
          Body: msg.body,
          From: msg.from,
        });
      }
      if (
        command === 'contribuir' ||
        command === '/doar' ||
        command === '/donate' ||
        command === 'doar'
      ) {
        return await this.donationMessage({ Body: msg.body, From: msg.from });
      }
      if (command === '/help' || command === 'ajuda' || command[0] === '/') {
        return await this.sendHelpMessage({ Body: msg.body, From: msg.from });
      }

      return await this.sendMessage({ Body: msg.body, From: msg.from });
    });

    this.client.initialize();
  }

  async sendResponse(createMessageDto: CreateMessageDto) {
    return await this.client.sendMessage(
      createMessageDto.to,
      createMessageDto.body,
    );
  }
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
      return await this.sendResponse({
        to: user,
        body: `  🙌 Olá! Você ama a ideia de IA WhatsApp que pode ajudar no dia a dia? 🤖

  🎉 Nós estamos construindo isso agora! Mas para continuar precisamos de sua ajuda.
    
  👉 Cada doação é importante e ajuda a manter e aprimorar o projeto. Use a chave PIX abaixo para fazer uma doação agora mesmo e faça parte da nossa missão de tornar IA's acessíveis para todos.

  🚀 Sua contribuição fará uma grande diferença para nós e para a comunidade. Obrigado pela sua generosidade! 😊
  
  🙏 Basta enviar a mensagem doar ou /doar🙏 `,
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
      return await this.sendResponse(content);
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
        chunks.forEach(async (chunk: string) => {
          return await this.sendResponse({
            to: clientId,
            body: chunk,
          });
        });
      } else {
        return await this.sendResponse({
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
      return await this.sendResponse(content);
    }
    content.body = prompt;
    content.imgUrl = createdImage;
    return await this.sendResponse(content);
  }

  async sendHelpMessage(messageDto: MessageDto) {
    const content = {
      to: messageDto.From,
      body: `
  🤖 Bem-vindo! Eu sou o seu assistente virtual. Aqui estão as funcionalidades disponíveis:

  💬 Conversação: Você pode conversar comigo e me perguntar qualquer coisa. Basta me enviar uma mensagem!
    
  🎨 Geração de imagens [OFF]: Você também pode gerar imagens incríveis usando o comando /imagine e fornecendo um prompt.

  🗑 Limpeza de histórico: Se quiser limpar o histórico de mensagens, é só usar o comando /clear

  👀 Quer ficar de olho em novas funcionalidades? é só enviar um /features
    
  👋 Se precisar de ajuda em algum momento, é só chamar! Estou aqui para ajudá-lo.`,
    };

    return await this.sendResponse(content);
  }

  async clearMessageHistory(messageDto: MessageDto) {
    const content = {
      to: messageDto.From,
      body: 'Histórico limpo com sucesso, como posso te ajudar hoje?',
    };

    await this.customerService.clearHistory(messageDto.From);
    return await this.sendResponse(content);
  }

  async donationMessage(messageDto: MessageDto) {
    const content = {
      to: messageDto.From,
      body: `
  🥳🥳 Muitooo obrigado 🥳🥳
    
  PIX CNPJ: 44.938.545-0001/19

  Sua contribuição é essencial
  para mantermos o projeto!
      `,
    };
    return await this.sendResponse(content);
  }
}
