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
