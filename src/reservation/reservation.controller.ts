import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Delete,
  Param,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { RolesGuard } from '../auth/guards/roles.guard';
import { JwtAuthGuard } from '../auth/guards/jwt.auth.guard';
import { Roles } from '../auth/guards/roles.meta';
import { User } from '../auth/decorator/user.decorator';

@UseGuards(RolesGuard)
@UseGuards(JwtAuthGuard)
@Controller('/api')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @Roles('client')
  @Post('/client/reservations/')
  async addReservation(@Body() data, @User() currentUser: any) {
    data.userId = currentUser.id;
    return await this.reservationService.addReservation(data);
  }

  @Roles('client')
  @Get('/client/reservations/')
  async getReservations(@Body() data, @User() currentUser: any) {
    data.userId = currentUser.id;
    return await this.reservationService.getReservations(data);
  }

  @Roles('client')
  @Delete('/client/reservations/:id/')
  async removeReservation(@Param('id') id: string, @User() currentUser: any) {
    // 403 - если ID текущего пользователя не совпадает с ID пользователя в брони;
    // 400 - если брони с указанным ID не существует.

    const result = await this.reservationService.getReservationId(id);
    if (result) {
      if (result.userId.toString() === currentUser.id.toString()) {
        return await this.reservationService.removeReservation(id);
      } else {
        throw new HttpException('FORBIDDEN', HttpStatus.FORBIDDEN);
      }
    } else {
      throw new HttpException('BAD_REQUEST', HttpStatus.BAD_REQUEST);
    }
  }

  @Roles('manager')
  @Get('/manager/reservations/:userId/')
  async getReservation(@Param('userId') userId: string, @Body() data) {
    data.userId = userId;
    return await this.reservationService.getReservations(data);
  }

  @Roles('manager')
  @Delete('/manager/reservations/:id/')
  async removeReservationManager(@Param('id') id: string) {
    return await this.reservationService.removeReservation(id);
  }
}
