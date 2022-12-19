import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { User } from '../../user/mongoose/user.schema';

export type SupportDocument = SupportRequest & Document;
export type MessageDocument = Message & Document;

@Schema()
export class SupportRequest {
  _id: mongoose.Types.ObjectId;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  })
  public user: User;

  @Prop({ required: true, default: new Date() })
  public createdAt: Date;

  @Prop({
    required: false,
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Message',
  })
  public messages: Message[];

  @Prop({ required: false, default: true })
  public isActive: boolean;
}
export const SupportSchema = SchemaFactory.createForClass(SupportRequest);

@Schema()
export class Message {
  _id: mongoose.Types.ObjectId;

  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  })
  public author: User;

  @Prop({ required: false, default: new Date() }) //required: true
  public sentAt: Date;

  @Prop({ required: false })
  public text: string;

  @Prop({ required: false })
  public readAt: Date;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
