import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Query,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthService } from '../auth/auth.service';
import { CreateUserParams, SignUp } from '../interfaces/user.interfaces';
import { JwtAuthGuard } from '../auth/guards/jwt.auth.guard';
import { Roles } from '../auth/guards/roles.meta';

@Controller('/api')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}
  @Post('/client/register')
  async signup(@Body() data: CreateUserParams) {
    const email = await this.userService.findByEmail(data.email);
    if (email) {
      throw new HttpException('email not exist', HttpStatus.BAD_REQUEST);
    }
    if (
      !/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/.test(data.password) ||
      data.password.length < 6
    ) {
      throw new Error('Please enter a valid password');
    }
    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(data.email)) {
      throw new Error('Please enter a valid email');
    }
    return await this.userService.create(data);
  }

  @Post('/auth/login')
  async signIn(@Req() request, @Body() data: SignUp) {
    const user = await this.authService.validateUser(data.email, data.password);
    if (!user) {
      throw new UnauthorizedException();
    }
    request.session.user = user;
    return this.authService.signin(user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/auth/logout')
  async logout(@Req() request) {
    request.session.destroy();
    if (request.session) {
      return { status: 'error', data: 'failed to exit' };
    }
    return { status: 'success' };
  }

  @UseGuards(JwtAuthGuard)
  @Roles('admin')
  @Post('/admin/users/')
  async create(@Body() data) {
    const email = await this.userService.findByEmail(data.email);
    if (email) {
      return { status: 'error', data: 'this email exists' };
    }

    return await this.userService.create(data);
  }

  @UseGuards(JwtAuthGuard)
  @Roles('admin')
  @Get('/admin/users/')
  async getUserAdmin(
    @Query('name') name: string,
    @Query('email') email: string,
    @Query('contactPhone') contactPhone: string,
    @Query('limit') limit: number,
    @Query('offset') offset: number,
  ) {
    const data = {
      name: name,
      email: email,
      contactPhone: contactPhone,
      limit: limit,
      offset: offset,
    };
    return await this.userService.findAll(data);
  }

  @UseGuards(JwtAuthGuard)
  @Roles('manager')
  @Get('/manager/users/')
  async getUserManager(
    @Query('name') name: string,
    @Query('email') email: string,
    @Query('contactPhone') contactPhone: string,
    @Query('limit') limit: number,
    @Query('offset') offset: number,
  ) {
    const data = {
      name: name,
      email: email,
      contactPhone: contactPhone,
      limit: limit,
      offset: offset,
    };
    return await this.userService.findAll(data);
  }
}
