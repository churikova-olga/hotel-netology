import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SearchUserParams } from '../interfaces/user.interfaces';
import { User, UserDocument } from './mongoose/user.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private readonly UserModel: Model<UserDocument>,
  ) {}

  async create(data: SearchUserParams): Promise<User> {
    const passwordHash = await bcrypt.hash(data.password, 10);
    const user = new this.UserModel({ ...data, password: passwordHash });
    return user.save();
  }

  async findByEmail(email: string): Promise<User> {
    return await this.UserModel.findOne({ email: email }).exec();
  }
  async findById(id: string): Promise<User> {
    const result = await this.UserModel.findOne({ _id: id }).exec();
    if (!result) {
      throw new NotFoundException('User not found');
    }
    return result;
  }
  async findAll(params: SearchUserParams): Promise<User[]> {
    const result = await this.UserModel.find({
      name: { $regex: params.name },
      email: { $regex: params.email },
      contactPhone: { $regex: params.contactPhone },
    }).exec();
    console.log(result);
    if (!result) {
      throw new NotFoundException('Users not found');
    }
    return result;
  }
}
