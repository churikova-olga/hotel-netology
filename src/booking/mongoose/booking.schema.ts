import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { User } from '../../user/mongoose/user.schema';
import { Hotel } from '../../Hotel/mongoose/hotel.schema';
import { HotelRoom } from '../../Hotel/mongoose/hotel.room.schema';
export type BookingDocument = Booking & Document;

@Schema()
export class Booking {
  _id: mongoose.Types.ObjectId;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  })
  public userId: User;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hotel',
  })
  public hotelId: string;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'HotelRoom',
  })
  public roomId: string;

  @Prop({ required: true })
  public dateStart: Date;

  @Prop({ required: true })
  public dateEnd: Date;
}

export const BookingSchema = SchemaFactory.createForClass(Booking);
