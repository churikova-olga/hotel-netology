import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Message,
  MessageDocument,
  SupportDocument,
  SupportRequest,
} from './mongoose/support.schema';
import {
  ISupportRequestEmployeeService,
  MarkMessagesAsReadDto,
} from '../interfaces/support.interfaces';

@Injectable()
export class SupportRequestEmployeeService
  implements ISupportRequestEmployeeService
{
  constructor(
    @InjectModel(SupportRequest.name)
    private readonly SupportModel: Model<SupportDocument>,
    @InjectModel(Message.name)
    private readonly MessageModel: Model<MessageDocument>,
  ) {}

  async markMessagesAsRead(params: MarkMessagesAsReadDto) {
    const result = await this.SupportModel.findById({
      _id: params.supportRequest,
    }).populate({ path: 'messages', select: ['_id', 'readAt', 'author'] });

    const message = [];

    for (let i = 0; i < result.messages.length; i++) {
      if (
        result.messages[i]['readAt'] === undefined &&
        result.messages[i]['author'].toString() !== params.user.toString()
      ) {
        message.push(result.messages[i]['_id']);
      }
    }
    await this.MessageModel.updateMany(
      { $expr: { $in: ['$_id', message] } },
      { $set: { readAt: params.createdBefore } },
    ).exec();

    return { success: true };
  }

  async getUnreadCount(
    supportRequest: string,
    user: string,
  ): Promise<Message[]> {
    const message = [];
    const result = await this.SupportModel.findById({
      _id: supportRequest,
    }).populate({ path: 'messages', select: ['_id', 'readAt', 'author'] });

    for (let i = 0; i < result.messages.length; i++) {
      if (
        result.messages[i]['readAt'] === undefined &&
        result.messages[i]['author'].toString() === user.toString()
      ) {
        message.push(result.messages[i]['_id']);
      }
    }
    return await this.MessageModel.find({
      $expr: { $in: ['$_id', message] },
    }).exec();
  }

  async closeRequest(supportRequest: string): Promise<void> {
    // для менеджера
    await this.SupportModel.findOneAndUpdate(
      {
        _id: supportRequest,
      },
      { isActive: false },
    );
  }
}
