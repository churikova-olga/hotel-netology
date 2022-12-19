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
