import { User } from '../user/mongoose/user.schema';

export interface SignUp {
  email: string;
  password: string;
}

export interface SearchUserParams {
  limit: number;
  offset: number;
  name: string;
  contactPhone: string;
  email: string;
}

export interface CreateUserParams {
  name: string;
  contactPhone: string;
  email: string;
  password: string;
}

export interface IUserService {
  create(data: Partial<User>): Promise<User>;
  findById(id: string): Promise<User>;
  findByEmail(email: string): Promise<User>;
  findAll(params: SearchUserParams): Promise<User[]>;
}
