import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { HotelModule } from './Hotel/hotel.module';
import { AuthModule } from './auth/auth.module';
import { MulterModule } from '@nestjs/platform-express';
import { BookingModule } from './booking/booking.module';
import { SupportModule } from './support/support.module';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URL),
    UserModule,
    AuthModule,
    HotelModule,
    BookingModule,
    SupportModule,
    MulterModule.register({
      dest: './uploads',
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
