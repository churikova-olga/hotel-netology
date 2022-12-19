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
  CreateSupportRequestDto,
  GetChatListParams,
  MarkMessagesAsReadDto,
  SendMessageDto,
} from '../interfaces/support.interfaces';
import { Socket } from 'socket.io';

import { WsException } from '@nestjs/websockets';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class SupportService {
  constructor(
    @InjectModel(SupportRequest.name)
    private readonly SupportModel: Model<SupportDocument>,
    @InjectModel(Message.name)
    private readonly MessageModel: Model<MessageDocument>,
    private readonly AuthService: AuthService,
  ) {}

  async createSupportRequest(
    data: CreateSupportRequestDto,
  ): Promise<SupportRequest> {
    const supportRequest = new this.SupportModel(data);
    return supportRequest.save();
  }

  async sendMessage(data: SendMessageDto): Promise<Message> {
    const message = {
      author: data.author,
      text: data.text,
    };
    const messagesRes = new this.MessageModel(message);

    await this.SupportModel.findOneAndUpdate(
      { _id: data.supportRequest },
      {
        $push: { messages: messagesRes._id },
      },
      { new: true },
    );
    return messagesRes.save();
  }
  async getMessages(supportRequest: string): Promise<Message[]> {
    const result = await this.SupportModel.findById({
      _id: supportRequest,
    })
      .populate('messages')
      .populate({
        path: 'messages',
        populate: { path: 'author', select: ['_id', 'name'] },
      });
    return result.messages;
  }

  async findSupportRequests(
    params: GetChatListParams,
  ): Promise<SupportRequest[]> {
    const findParams = {};
    if (params.offset) {
      findParams['offset'] = params.offset;
    }
    if (params.limit) {
      findParams['limit'] = params.limit;
    }
    if (params.isActive) {
      findParams['isActive'] = params.isActive;
    }
    if (params.user !== null) {
      findParams['user'] = params.user;
    }
    return await this.SupportModel.find(findParams).exec();
  }
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

  async getUnreadCount(supportRequest: string, user: string) {
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
    const count = await this.MessageModel.find({
      $expr: { $in: ['$_id', message] },
    }).exec();

    return { count: count.length, messages: count };
  }

  async getUserFromSocket(socket: Socket) {
    const authenticationToken = socket.handshake.headers.authorization;
    if (!authenticationToken) {
      return new WsException('Invalid token.');
    }
    const token = authenticationToken.split(' ')[1];
    const user = await this.AuthService.getUserFromAuthenticationToken(token);
    if (!user) {
      throw new WsException('Invalid credentials.');
    }
    return user;
  }

  async closeRequest(supportRequest: string) {
    // для менеджера
    await this.SupportModel.findOneAndUpdate(
      {
        _id: supportRequest,
      },
      { isActive: false },
    );
  }

  async findByRequest(data) {
    const result = await this.SupportModel.findById({
      _id: data.supportRequest,
      isActive: data.isActive,
    }).populate({ path: 'messages', select: ['_id', 'readAt', 'author'] });
    if (result) {
      if (
        data.user.roles === 'client' &&
        data.user._id.toString() === result.user._id.toString()
      ) {
        return result;
      } else if (data.user.roles === 'manager') return result;
      else return { status: 'error', data: 'no access' };
    } else return { status: 'error', data: 'Request does not exist' };
  }
}
