import { forwardRef, Module } from '@nestjs/common';
import { HotelAdminController } from './hotel.admin.controller';
import { HotelCommonController } from './hotel.common.controller';
import { HotelService } from './hotel.service';
import { MongooseModule } from '@nestjs/mongoose';
import { HotelSchema, Hotel } from './mongoose/hotel.schema';
import { HotelRoomSchema, HotelRoom } from './mongoose/hotel.room.schema';
import { ReservationModule } from '../reservation/reservation.module';
import { HotelRoomService } from './hotel.room.service';

@Module({
  imports: [
    forwardRef(() => ReservationModule),
    MongooseModule.forFeature([
      { name: Hotel.name, schema: HotelSchema },
      { name: HotelRoom.name, schema: HotelRoomSchema },
    ]),
  ],
  controllers: [HotelCommonController, HotelAdminController],
  providers: [HotelService, HotelRoomService],
  exports: [HotelService, HotelRoomService],
})
export class HotelModule {}
