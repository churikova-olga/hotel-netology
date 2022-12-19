import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Hotel, HotelDocument } from './mongoose/hotel.schema';
import { HotelRoom, HotelRoomDocument } from './mongoose/hotel.room.schema';

import {
  SearchHotelParams,
  SearchRoomsParams,
  UpdateHotelParams,
  UpdateHotelRoomsParams,
} from '../interfaces/hotel.interfaces';

@Injectable()
export class HotelService {
  constructor(
    @InjectModel(Hotel.name)
    private readonly HotelModel: Model<HotelDocument>,
    @InjectModel(HotelRoom.name)
    private readonly HotelRoomModel: Model<HotelRoomDocument>,
  ) {}

  async createHotel(data: any): Promise<Hotel> {
    const hotel = new this.HotelModel({ ...data });
    return hotel.save();
  }

  async findByidHotel(id: string): Promise<Hotel> {
    const result = await this.HotelModel.findOne({ _id: id }).exec();
    if (!result) {
      throw new NotFoundException('Hotel not found');
    }
    return result;
  }

  async searchHotel(params: SearchHotelParams): Promise<Hotel[]> {
    const findParams = {};
    if (params.title) {
      findParams['title'] = params.title;
    }

    if (params.offset) {
      findParams['offset'] = params.offset;
    }

    if (params.limit) {
      findParams['limit'] = params.limit;
    }
    return await this.HotelModel.find(findParams).exec();
  }

  async updateHotel(id: string, data: UpdateHotelParams): Promise<Hotel> {
    data['updatedAt'] = new Date();
    return this.HotelModel.findOneAndUpdate({ _id: id }, data).exec();
  }

  async createHotelRoom(data: any): Promise<HotelRoom> {
    await this.findByidHotel(data.hotel);
    const hotelRoom = new this.HotelRoomModel({ ...data });
    return hotelRoom.save();
  }

  async findByidHotelRoom(id: string): Promise<HotelRoom> {
    const result = await this.HotelRoomModel.findOne({ _id: id }).exec();
    if (!result) {
      throw new NotFoundException('Hotel room not found');
    }
    return result;
  }

  async searchHotelRoom(params: SearchRoomsParams): Promise<HotelRoom[]> {
    const findParams = {};
    if (params.hotel) {
      findParams['hotel'] = params.hotel;
    }
    if (params.offset) {
      findParams['offset'] = params.offset;
    }
    if (params.limit) {
      findParams['limit'] = params.limit;
    }
    if (params.isEnabled !== null) {
      findParams['isEnabled'] = params.isEnabled;
    }
    return await this.HotelRoomModel.find(findParams).exec();
  }

  async updateHotelRoom(
    id: string,
    data: UpdateHotelRoomsParams,
  ): Promise<HotelRoom> {
    data['updatedAt'] = new Date();
    return this.HotelRoomModel.findOneAndUpdate({ _id: id }, data).exec();
  }
}
