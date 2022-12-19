import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  Put,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { HotelService } from './hotel.service';
import {
  UpdateHotelParams,
  UpdateHotelRoomsParams,
} from '../interfaces/hotel.interfaces';
import { RolesGuard } from '../auth/guards/roles.guard';
import { JwtAuthGuard } from '../auth/guards/jwt.auth.guard';
import { Roles } from '../auth/guards/roles.meta';
import { FilesInterceptor } from '@nestjs/platform-express';
import { editFileName, imageFileFilter } from '../utils/file-upload.utils';
import { diskStorage } from 'multer';

@Controller('/api/admin')
@UseGuards(RolesGuard)
@UseGuards(JwtAuthGuard)
export class HotelAdminController {
  constructor(private readonly hotelService: HotelService) {}

  @Roles('admin')
  @Post('/hotels/')
  async createHotel(@Body() data: any) {
    return await this.hotelService.createHotel(data);
  }

  @Roles('admin')
  @Get('/hotels/:id/')
  async findId(@Param('id') id: string) {
    return await this.hotelService.findByidHotel(id);
  }

  @Roles('admin')
  @Get('/hotels/')
  async getHotel(
    @Query('title') title: string,
    @Query('limit') limit: number,
    @Query('offset') offset: number,
  ) {
    const params = {
      title: title,
      limit: limit,
      offset: offset,
    };
    return await this.hotelService.searchHotel(params);
  }

  @Roles('admin')
  @Put('/hotels/:id/')
  async updateHotel(@Param('id') id: string, @Body() data: UpdateHotelParams) {
    return await this.hotelService.updateHotel(id, data);
  }

  @Roles('admin')
  @UseInterceptors(
    FilesInterceptor('images', 10, {
      storage: diskStorage({
        destination: './uploads',
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  @Post('/hotel-rooms/')
  async createHotelRoom(@UploadedFiles() files, @Body() data: any) {
    const response = [];
    files.forEach((file) => {
      const fileReponse = {
        originalname: file.originalname,
        filename: file.filename,
      };
      response.push(fileReponse);
    });
    data.images = response;
    return await this.hotelService.createHotelRoom(data);
  }

  @Roles('admin')
  @UseInterceptors(
    FilesInterceptor('images', 10, {
      storage: diskStorage({
        destination: './uploads',
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  @Put('/hotel-rooms/:id/')
  async updateHotelRoom(
    @UploadedFiles() files,
    @Param('id') id: string,
    @Body() data: UpdateHotelRoomsParams,
  ) {
    console.log(files);
    const response = [];
    files.forEach((file) => {
      const fileReponse = {
        originalname: file.originalname,
        filename: file.filename,
      };
      response.push(fileReponse);
    });
    data.images = response;
    return await this.hotelService.updateHotelRoom(id, data);
  }
}
