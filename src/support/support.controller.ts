import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { SupportService } from './support.service';
import { RolesGuard } from '../auth/guards/roles.guard';
import { JwtAuthGuard } from '../auth/guards/jwt.auth.guard';
import { Roles } from '../auth/guards/roles.meta';
import { User } from '../auth/decorator/user.decorator';

@UseGuards(RolesGuard)
@UseGuards(JwtAuthGuard)
@Controller('/api')
export class SupportController {
  constructor(private readonly supportService: SupportService) {}

  @Roles('client', 'manager')
  @Get('/common/support-requests/:id/messages')
  async getMessages(@Param('id') id) {
    return await this.supportService.getMessages(id);
  }
  @Post('/client/support-requests/')
  async createRequest(@User() currentUser: any, @Body() data) {
    data['user'] = currentUser.id;
    return await this.supportService.createSupportRequest(data);
  }

  @Roles('client', 'manager')
  @Post('/common/support-requests/:id/messages')
  async sendMessage(
    @Body() data,
    @User() currentUser: any,
    @Param('id') id: string,
  ) {
    data['author'] = currentUser.id;
    data['supportRequest'] = id;
    return await this.supportService.sendMessage(data);
  }

  @Roles('client')
  @Get('/client/support-requests/')
  async clientFindRequest(
    @User() currentUser: any,
    @Query('isActive') isActive: boolean,
    @Query('limit') limit: number,
    @Query('offset') offset: number,
  ) {
    const params = {
      user: currentUser.id,
      isActive: isActive,
      limit: limit,
      offset: offset,
    };
    return await this.supportService.findSupportRequests(params);
  }

  @Roles('manager')
  @Get('/manager/support-requests/')
  async managerFindRequest(
    @Query('isActive') isActive: boolean,
    @Query('limit') limit: number,
    @Query('offset') offset: number,
  ) {
    const params = {
      user: null,
      isActive: isActive,
      limit: limit,
      offset: offset,
    };
    return await this.supportService.findSupportRequests(params);
  }

  @Roles('manager', 'client')
  @Post('/common/support-requests/:id/messages/read/')
  async markMessagesAsRead(@User() currentUser: any, @Param('id') id: string) {
    const params = {
      user: currentUser.id,
      supportRequest: id, //id
      createdBefore: new Date(),
    };
    return await this.supportService.markMessagesAsRead(params);
  }

  @Roles('manager', 'client')
  @Get('/common/support-requests/:id/messages/count/')
  async getUnreadCount(@User() currentUser: any, @Param('id') id: string) {
    return await this.supportService.getUnreadCount(id, currentUser.id);
  }
}
