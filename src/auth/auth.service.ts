import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.userService.findByEmail(email);
    const matchPassword = await bcrypt.compare(password, user.password);
    if (user && matchPassword) {
      return {
        id: user._id,
        email: user.email,
        name: user.name,
        contactPhone: user.contactPhone,
        roles: user.roles,
      };
    }

    return null;
  }

  async validateJwtUser(email: string, id: string) {
    const user = await this.userService.findByEmail(email);
    const userId = String(user._id);
    if (user && userId === id) {
      return {
        id: user._id,
        email: user.email,
        name: user.name,
        contactPhone: user.contactPhone,
        roles: user.roles,
      };
    }
    return null;
  }

  signin(user) {
    const payload = {
      id: user.id,
      email: user.email,
      roles: user.roles,
    };
    return this.jwtService.sign(payload);
  }

  public async getUserFromAuthenticationToken(token: string) {
    const payload = this.jwtService.verify(token);
    if (payload.id) {
      return this.userService.findById(payload.id);
    }
  }
}
