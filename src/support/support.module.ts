import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Message,
  MessageSchema,
  SupportRequest,
  SupportSchema,
} from './mongoose/support.schema';
import { SupportService } from './support.service';
import { SupportController } from './support.controller';
import { ChatGateway } from './chat.gateway';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SupportRequest.name, schema: SupportSchema },
      { name: Message.name, schema: MessageSchema },
    ]),
    forwardRef(() => AuthModule),
  ],
  controllers: [SupportController],
  providers: [SupportService, ChatGateway],
  exports: [SupportService, ChatGateway],
})
export class SupportModule {}
