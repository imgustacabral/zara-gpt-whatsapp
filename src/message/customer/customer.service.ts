import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CustomerService {
  constructor(private readonly prisma: PrismaService) {}
  async findCustomer(id: string) {
    return await this.prisma.customer.findFirst({
      where: {
        user: id,
      },
      include: {
        messages: {
          select: {
            role: true,
            content: true,
          },
        },
      },
    });
  }

  async createCustomer(data: Prisma.CustomerCreateInput) {
    return await this.prisma.customer.create({
      data,
    });
  }

  async saveMessage(data: Prisma.MessageCreateInput) {
    return await this.prisma.message.create({
      data,
    });
  }

  async clearHistory(user: string) {
    const customer = await this.findCustomer(user);
    if (!customer) return;
    try {
      return await this.prisma.customer.delete({
        where: {
          user,
        },
      });
    } catch (e) {
      console.log(e);
    }
  }

  async getMessagesContext(user: string) {
    try {
      const customer = await this.findCustomer(user);
      const messages = customer.messages;

      const context = [];
      messages.forEach((message) => {
        context.push(message);
      });
      return context;
    } catch (e) {
      console.log(e);
    }
  }
}
