import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

export type HotelDocument = Hotel & Document;
@Schema()
export class Hotel {
  _id: mongoose.Types.ObjectId;

  @Prop({
    required: true,
  })
  public title: mongoose.Types.ObjectId;

  @Prop({ required: false })
  public description: string;

  @Prop({ default: new Date(), required: true })
  public createdAt: Date;

  @Prop({ default: new Date(), required: true })
  public updatedAt: Date;
}

export const HotelSchema = SchemaFactory.createForClass(Hotel);
