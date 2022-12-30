import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Hotel, HotelDocument } from './mongoose/hotel.schema';

import {
  IHotelService,
  SearchHotelParams,
  UpdateHotelParams,
} from '../interfaces/hotel.interfaces';

@Injectable()
export class HotelService implements IHotelService {
  constructor(
    @InjectModel(Hotel.name)
    private readonly HotelModel: Model<HotelDocument>,
  ) {}

  async create(data: any): Promise<Hotel> {
    const hotel = new this.HotelModel({ ...data });
    return hotel.save();
  }

  async findById(id: string): Promise<Hotel> {
    const result = await this.HotelModel.findOne({ _id: id }).exec();
    if (!result) {
      throw new NotFoundException('hotel not found');
    }
    return result;
  }

  async search(params: SearchHotelParams): Promise<Hotel[]> {
    const findParams = {};
    if (params.title) {
      findParams['title'] = params.title;
    }
    return await this.HotelModel.find(findParams)
      .limit(params.limit)
      .skip(params.offset)
      .exec();
  }

  async update(id: string, data: UpdateHotelParams): Promise<Hotel> {
    data['updatedAt'] = new Date();
    return this.HotelModel.findOneAndUpdate({ _id: id }, data).exec();
  }
}
