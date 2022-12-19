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
import { BookingService } from './booking.service';
import { RolesGuard } from '../auth/guards/roles.guard';
import { JwtAuthGuard } from '../auth/guards/jwt.auth.guard';
import { Roles } from '../auth/guards/roles.meta';
import { User } from '../auth/decorator/user.decorator';

//
// interface IReservation {
//   addReservation(data: ReservationDto): Promise<Reservation>;
//   removeReservation(id: ID): Promise<void>;
//   getReservations(
//       filter: ReservationSearchOptions,
//   ): Promise<Array<Reservation>>;
// }
@UseGuards(RolesGuard)
@UseGuards(JwtAuthGuard)
@Controller('/api')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Roles('client')
  @Post('/client/reservations/')
  async addReservation(@Body() data, @User() currentUser: any) {
    data.userId = currentUser.id;
    return await this.bookingService.addReservation(data);
  }

  @Roles('client')
  @Get('/client/reservations/')
  async getReservations(@Body() data, @User() currentUser: any) {
    data.userId = currentUser.id;
    return await this.bookingService.getReservations(data);
  }

  @Roles('client')
  @Delete('/client/reservations/:id/')
  async removeReservation(@Param('id') id: string, @User() currentUser: any) {
    // 403 - если ID текущего пользователя не совпадает с ID пользователя в брони;
    // 400 - если брони с указанным ID не существует.

    const result = await this.bookingService.getReservationId(id);
    if (result) {
      if (result.userId.toString() === currentUser.id.toString()) {
        return await this.bookingService.removeReservation(id);
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
    return await this.bookingService.getReservations(data);
  }

  @Roles('manager')
  @Delete('/manager/reservations/:id/')
  async removeReservationManager(@Param('id') id: string) {
    return await this.bookingService.removeReservation(id);
  }
}
