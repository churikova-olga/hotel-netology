import { Controller, Get, Param, Query } from '@nestjs/common';
import { HotelService } from './hotel.service';
import { User } from '../auth/decorator/user.decorator';

@Controller('/api/common')
export class HotelCommonController {
  constructor(private readonly hotelService: HotelService) {}
  @Get('/hotel-rooms/:id/')
  async findIdRoom(@Param('id') id: string) {
    return await this.hotelService.findByidHotelRoom(id);
  }

  @Get('/hotel-rooms/')
  async getHotelRoom(
    @User() currentUser: any,
    @Query('title') hotel: string,
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

    return await this.hotelService.searchHotelRoom(params);
  }
}
