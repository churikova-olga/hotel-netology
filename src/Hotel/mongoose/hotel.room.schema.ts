import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Hotel } from './hotel.schema';

export type HotelRoomDocument = HotelRoom & Document;

@Schema()
export class HotelRoom {
  _id: mongoose.Types.ObjectId;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hotel',
  })
  public hotel: Hotel;

  @Prop({ required: false })
  public description: string;

  @Prop({ default: [], required: false })
  public images: string[];

  @Prop({ default: new Date(), required: true })
  public createdAt: Date;

  @Prop({ default: new Date(), required: true })
  public updatedAt: Date;

  @Prop({ default: true, required: true })
  public isEnabled: boolean;
}

export const HotelRoomSchema = SchemaFactory.createForClass(HotelRoom);
