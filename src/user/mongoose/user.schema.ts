import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
export type UserDocument = User & Document;

@Schema()
export class User {
  _id: mongoose.Types.ObjectId;

  @Prop({
    required: true,
    unique: true,
    validate: {
      validator: function (email) {
        return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);
      },
      message: 'Please enter a valid email',
    },
  })
  public email: string;

  @Prop({ required: true })
  public password: string;

  @Prop({ required: true })
  public name: string;

  @Prop({ required: false })
  public contactPhone: string;

  @Prop({ default: 'client', required: false })
  public roles: string;

  // @Prop({ required: false })
  // public limit: number;
  // @Prop({ required: false })
  // public offset: number;
}

export const UserSchema = SchemaFactory.createForClass(User);
