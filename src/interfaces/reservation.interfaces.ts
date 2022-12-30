import { Reservation } from '../reservation/mongoose/reservation.schema';

export interface ReservationDto {
  userId: string; //id
  hotelId: string; //id
  roomId: string; //id
  dateStart: Date;
  dateEnd: Date;
}

export interface ReservationSearchOptions {
  userId: string; //id
  dateStart: Date;
  dateEnd: Date;
}

export interface IReservation {
  addReservation(data: ReservationDto): Promise<Reservation>;
  removeReservation(id: string): Promise<void>;
  getReservations(
    filter: ReservationSearchOptions,
  ): Promise<Array<Reservation>>;
}
