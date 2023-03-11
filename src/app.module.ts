import { Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';
import { MessageModule } from './message/message.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MessageModule,
  ],
})
export class AppModule {}
