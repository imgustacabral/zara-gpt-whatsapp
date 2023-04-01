import { Module } from '@nestjs/common';
import { OpenAiService } from './open-ai/open-ai.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CustomerService } from './customer/customer.service';
import { MessageService } from './message.service';
import { RouterService } from './router/router.service';

@Module({
  imports: [],
  providers: [
    PrismaService,
    OpenAiService,
    CustomerService,
    MessageService,
    RouterService,
  ],
})
export class MessageModule {
  constructor(public routerService: RouterService) {
    this.routerService.initialize();
  }
}
