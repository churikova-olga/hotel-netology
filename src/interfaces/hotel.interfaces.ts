import { Hotel } from '../hotel/mongoose/hotel.schema';
import { HotelRoom } from '../hotel/mongoose/hotel.room.schema';

export interface SearchHotelParams {
  limit: number;
  offset: number;
  title: string;
}

export interface UpdateHotelParams {
  title: string;
  description: string;
}

export interface SearchRoomsParams {
  limit: number;
  offset: number;
  hotel: string; //id
  isEnabled?: boolean;
}

export interface UpdateHotelRoomsParams {
  description: string;
  hotelId: string;
  isEnabled: boolean;
  images: string[] | File;
}

export interface IHotelService {
  create(data: any): Promise<Hotel>;
  findById(id: string): Promise<Hotel>;
  search(params: SearchHotelParams): Promise<Hotel[]>;
  update(id: string, data: UpdateHotelParams): Promise<Hotel>;
}

export interface HotelRoomService {
  create(data: Partial<HotelRoom>): Promise<HotelRoom>;
  findById(id: string): Promise<HotelRoom>;
  search(params: SearchRoomsParams): Promise<HotelRoom[]>;
  update(id: string, data: Partial<HotelRoom>): Promise<HotelRoom>;
}
