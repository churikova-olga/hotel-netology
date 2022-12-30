import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { HotelRoom, HotelRoomDocument } from './mongoose/hotel.room.schema';
import { HotelService } from './hotel.service';
import {
  SearchRoomsParams,
  UpdateHotelRoomsParams,
} from '../interfaces/hotel.interfaces';

@Injectable()
export class HotelRoomService implements HotelRoomService {
  constructor(
    @InjectModel(HotelRoom.name)
    private readonly HotelRoomModel: Model<HotelRoomDocument>,
    private hotelService: HotelService,
  ) {}

  async create(data: any): Promise<HotelRoom> {
    await this.hotelService.findById(data.hotel);
    const hotelRoom = new this.HotelRoomModel({ ...data });
    return hotelRoom.save();
  }

  async findById(id: string): Promise<HotelRoom> {
    const result = await this.HotelRoomModel.findOne({ _id: id }).exec();
    if (!result) {
      throw new NotFoundException('hotel room not found');
    }
    return result;
  }

  async search(params: SearchRoomsParams): Promise<HotelRoom[]> {
    const findParams = {};
    if (params.hotel) {
      findParams['hotel'] = params.hotel;
    }
    if (params.isEnabled !== null) {
      findParams['isEnabled'] = params.isEnabled;
    }
    return await this.HotelRoomModel.find(findParams)
      .limit(params.limit)
      .skip(params.offset)
      .exec();
  }

  async update(id: string, data: UpdateHotelRoomsParams): Promise<HotelRoom> {
    data['updatedAt'] = new Date();
    return this.HotelRoomModel.findOneAndUpdate({ _id: id }, data).exec();
  }
}
