import { Controller, Get, Param, Query } from '@nestjs/common';
import { HotelRoomService } from './hotel.room.service';
import { User } from '../auth/decorator/user.decorator';

@Controller('/api/common')
export class HotelCommonController {
  constructor(private readonly hotelRoomService: HotelRoomService) {}
  @Get('/hotel-rooms/:id/')
  async findIdRoom(@Param('id') id: string) {
    return await this.hotelRoomService.findById(id);
  }

  @Get('/hotel-rooms/')
  async getHotelRoom(
    @User() currentUser: any,
    @Query('hotel') hotel: string,
    @Query('limit') limit: number,
    @Query('offset') offset: number,
  ) {
    const params = {
      hotel: hotel,
      limit: limit,
      offset: offset,
      isEnabled: null,
    };
    if (currentUser === null || currentUser.roles === 'client') {
      params.isEnabled = true;
    }

    return await this.hotelRoomService.search(params);
  }
}
