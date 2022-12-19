import { forwardRef, Module } from '@nestjs/common';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';
import { MongooseModule } from '@nestjs/mongoose';
import { BookingSchema, Booking } from './mongoose/booking.schema';
import { HotelModule } from '../Hotel/hotel.module';

@Module({
  imports: [
    forwardRef(() => HotelModule),
    MongooseModule.forFeature([{ name: Booking.name, schema: BookingSchema }]),
  ],
  controllers: [BookingController],
  providers: [BookingService],
  exports: [BookingService],
})
export class BookingModule {}
