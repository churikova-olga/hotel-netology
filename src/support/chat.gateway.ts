import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SupportService } from './support.service';
import { UseGuards } from '@nestjs/common';
import { GatewaySocketGuard } from '../auth/guards/jwt.auth.guard';
import { Roles } from '../auth/guards/roles.meta';
import { RolesSocketGuard } from '../auth/guards/roles.socket.guard';

@UseGuards(GatewaySocketGuard)
@UseGuards(RolesSocketGuard)
@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  constructor(private readonly supportService: SupportService) {}

  async handleConnection(socket: Socket) {
    if (socket.handshake.query.id !== undefined) {
      socket.data['chat'] = socket.handshake.query.id;
      const user = await this.supportService.getUserFromSocket(socket);

      const data = {
        supportRequest: socket.data['chat'],
        user: null,
        isActive: true,
      };
      if (!(user instanceof WsException)) {
        data['user'] = user;
      }
      const result = await this.supportService.findByRequest(data);
      if (result['status'] !== undefined && result['status'] === 'error') {
        return socket.disconnect();
      }
    } else return socket.disconnect();
    console.log(`Connected ${socket.id}`);
  }
  async handleDisconnect(socket: Socket) {
    console.log(`Disconnected: ${socket.id}`);
  }

  @Roles('manager', 'client')
  @SubscribeMessage('send_message')
  async listenForMessages(
    @MessageBody() text: string,
    payload: string,
    @ConnectedSocket() socket: Socket,
  ) {
    const user = await this.supportService.getUserFromSocket(socket);
    const chatId = socket.data.chat;
    const data = {
      author: null, //id
      supportRequest: chatId, //id
      text: text,
    };
    const author = {};
    if (!(user instanceof WsException)) {
      data['author'] = user._id;
      author['name'] = user.name;
      author['contactPhone'] = user.contactPhone;
      author['roles'] = user.roles;
    }
    await this.supportService.sendMessage(data);
    this.server.sockets.emit('receive_message', {
      text,
      author,
    });
  }

  @Roles('manager', 'client')
  @SubscribeMessage('get_message')
  async getMessage(@ConnectedSocket() socket: Socket) {
    const chatId = socket.data.chat;
    const message = await this.supportService.getMessages(chatId);
    this.server.sockets.emit('get_message', {
      message,
    });
  }

  @Roles('manager', 'client')
  @SubscribeMessage('mark_message')
  async markMessagesAsRead(@ConnectedSocket() socket: Socket) {
    const chatId = socket.data.chat;
    const user = await this.supportService.getUserFromSocket(socket);
    const data = {
      user: null,
      supportRequest: chatId,
      createdBefore: new Date(),
    };
    if (!(user instanceof WsException)) {
      data['user'] = user._id;
    }
    await this.supportService.markMessagesAsRead(data);
    this.server.sockets.emit('mark_message', {
      data: 'success',
    });
  }

  @Roles('manager', 'client')
  @SubscribeMessage('count_message')
  async getUnreadCount(@ConnectedSocket() socket: Socket) {
    const chatId = socket.data.chat;
    const user = await this.supportService.getUserFromSocket(socket);
    const data = {
      user: null,
      supportRequest: chatId,
    };
    if (!(user instanceof WsException)) {
      data['user'] = user._id;
    }
    const res = await this.supportService.getUnreadCount(
      data.supportRequest,
      data.user,
    );

    this.server.sockets.emit('count_message', {
      res,
    });
  }

  @Roles('manager')
  @SubscribeMessage('close_request')
  async closeRequest(@ConnectedSocket() socket: Socket) {
    const chatId = socket.data.chat;
    await this.supportService.closeRequest(chatId);
    return socket.disconnect();
  }
}
