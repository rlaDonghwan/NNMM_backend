import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AuthModule } from './auth/auth.module'
import { UsersModule } from './users/users.module'
import { DatabaseModule } from './database/database.module'
import { ESGModule } from './esg/esg.module'
import { ChartConfigModule } from '@/chart-config/chart-config.module'
import { IndicatorModule } from './indicator/indicator.module'
import { EsgReportModule } from './esg-report/esg-report.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, //  모든 모듈에서 process.env 사용 가능
    }),
    AuthModule,
    UsersModule,
    DatabaseModule,
    ESGModule,
    ChartConfigModule,
    IndicatorModule,
    EsgReportModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
