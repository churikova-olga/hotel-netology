import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Reservation,
  ReservationDocument,
} from './mongoose/reservation.schema';
import {
  IReservation,
  ReservationDto,
  ReservationSearchOptions,
} from '../interfaces/reservation.interfaces';
import { HotelRoomService } from '../hotel/hotel.room.service';

@Injectable()
export class ReservationService implements IReservation {
  constructor(
    @InjectModel(Reservation.name)
    private readonly ReservationModel: Model<ReservationDocument>,
    private readonly hotelRoomService: HotelRoomService,
  ) {}
  async addReservation(data: ReservationDto): Promise<Reservation> {
    //проверка доступен ли номер
    const room = await this.hotelRoomService.findById(data.roomId);
    if (room) {
      if (room.isEnabled === false) {
        throw new HttpException('isEnabled false', HttpStatus.BAD_REQUEST);
      }
      const result = await this.ReservationModel.find(
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

      const booking = new this.ReservationModel(data);
      return booking.save();
    } else throw new HttpException('room not exist', HttpStatus.BAD_REQUEST);
  }

  async removeReservation(id: string): Promise<void> {
    const result = await this.ReservationModel.findOneAndRemove({
      _id: id,
    }).exec();
    if (!result) {
      throw new HttpException('reservation not exist', HttpStatus.BAD_REQUEST);
    }
  }

  async getReservations(
    filter: ReservationSearchOptions,
  ): Promise<Reservation[]> {
    const filterSearch = { userId: filter.userId };
    if (filter.dateStart) {
      filterSearch['dateStart'] = filter.dateStart;
    }
    if (filter.dateEnd) {
      filterSearch['dateEnd'] = filter.dateEnd;
    }
    return await this.ReservationModel.find(filterSearch).exec();
  }

  async getReservationId(id: string): Promise<Reservation> {
    return await this.ReservationModel.findById({ _id: id }).exec();
  }
}
