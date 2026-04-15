import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PropertiesModule } from './properties/properties.module';
import { BidsModule } from './bids/bids.module';
import { TransactionsModule } from './transactions/transactions.module';
import { ReviewsModule } from './reviews/reviews.module';
import { PointsModule } from './points/points.module';
import { AdminModule } from './admin/admin.module';
import { NotificationsModule } from './notifications/notifications.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(), // 역경매 타이머 스케줄러
    AuthModule,
    UsersModule,
    PropertiesModule,
    BidsModule,
    TransactionsModule,
    ReviewsModule,
    PointsModule,
    AdminModule,
    NotificationsModule,
  ],
})
export class AppModule {}
