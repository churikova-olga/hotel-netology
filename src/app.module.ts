import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { HotelModule } from './hotel/hotel.module';
import { AuthModule } from './auth/auth.module';
import { MulterModule } from '@nestjs/platform-express';
import { ReservationModule } from './reservation/reservation.module';
import { SupportModule } from './support/support.module';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URL),
    UserModule,
    AuthModule,
    HotelModule,
    ReservationModule,
    SupportModule,
    MulterModule.register({
      dest: './uploads',
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
