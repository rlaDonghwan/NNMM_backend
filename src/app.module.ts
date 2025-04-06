import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AuthModule } from './auth/auth.module'
import { UsersModule } from './users/users.module'
import { DatabaseModule } from './database/database.module'
import { IndicatorModule } from './indicator/indicator.module'
import { EsgDashboardModule } from './esg-dashboard/esg-dashboard.module'
import { EsgGoalModule } from './esg-goal/esg-goal.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, //  모든 모듈에서 process.env 사용 가능
    }),
    AuthModule,
    UsersModule,
    DatabaseModule,
    IndicatorModule,
    EsgDashboardModule,
    EsgGoalModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
