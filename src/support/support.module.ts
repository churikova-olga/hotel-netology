import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Message,
  MessageSchema,
  SupportRequest,
  SupportSchema,
} from './mongoose/support.schema';
import { SupportRequestService } from './support.request.service';
import { SupportController } from './support.controller';
import { ChatGateway } from './chat.gateway';
import { AuthModule } from '../auth/auth.module';
import { SupportRequestClientService } from './support.request.client.service';
import { SupportRequestEmployeeService } from './support.request.employee.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SupportRequest.name, schema: SupportSchema },
      { name: Message.name, schema: MessageSchema },
    ]),
    forwardRef(() => AuthModule),
  ],
  controllers: [SupportController],
  providers: [
    SupportRequestService,
    ChatGateway,
    SupportRequestClientService,
    SupportRequestEmployeeService,
  ],
  exports: [
    SupportRequestService,
    ChatGateway,
    SupportRequestClientService,
    SupportRequestEmployeeService,
  ],
})
export class SupportModule {}
