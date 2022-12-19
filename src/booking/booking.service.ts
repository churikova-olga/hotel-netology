import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Booking, BookingDocument } from './mongoose/booking.schema';
import {
  ReservationDto,
  ReservationSearchOptions,
} from '../interfaces/booking.interfaces';
import { HotelService } from '../Hotel/hotel.service';

@Injectable()
export class BookingService {
  constructor(
    @InjectModel(Booking.name)
    private readonly BookingModel: Model<BookingDocument>,
    private readonly hotelService: HotelService,
  ) {}
  async addReservation(data: ReservationDto): Promise<Booking> {
    //проверка доступен ли номер
    const room = await this.hotelService.findByidHotelRoom(data.roomId);
    if (room) {
      if (room.isEnabled === false) {
        throw new HttpException('isEnabled false', HttpStatus.BAD_REQUEST);
      }
      const result = await this.BookingModel.find(
        {
          hotelId: data.hotelId,
          roomId: data.roomId,
        },
        { dateEnd: 1, dateStart: 1 },
      ).exec();

      const dateEnd = new Date(data.dateEnd);
      const dateStart = new Date(data.dateStart);
      if (dateStart > dateEnd) {
        throw new HttpException('date incorrect', HttpStatus.BAD_REQUEST);
      }

      for (let i = 0; i < result.length; i++) {
        if (!(dateEnd < result[i].dateStart || dateStart > result[i].dateEnd)) {
          throw new HttpException('date reserved', HttpStatus.BAD_REQUEST);
        }
      }

      const booking = new this.BookingModel(data);
      return booking.save();
    } else throw new HttpException('room not exist', HttpStatus.BAD_REQUEST);
  }

  async removeReservation(id: string): Promise<Booking> {
    const result = await this.BookingModel.findOneAndRemove({ _id: id }).exec();
    if (!result) {
      throw new HttpException('reservation not exist', HttpStatus.BAD_REQUEST);
    }
    return result;
  }

  async getReservations(filter: ReservationSearchOptions): Promise<Booking[]> {
    const filterSearch = { userId: filter.userId };
    if (filter.dateStart) {
      filterSearch['dateStart'] = filter.dateStart;
    }
    if (filter.dateEnd) {
      filterSearch['dateEnd'] = filter.dateEnd;
    }
    return await this.BookingModel.find(filterSearch).exec();
  }

  async getReservationId(id: string): Promise<Booking> {
    return await this.BookingModel.findById({ _id: id }).exec();
  }
}
