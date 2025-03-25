import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config' // ✅ 추가
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AuthModule } from './auth/auth.module'
import { UsersModule } from './users/users.module'
import { DatabaseModule } from './database/database.module'
import { ESGModule } from './esg/esg.module'
import { ChartModule } from './chart/chart.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // ✅ 모든 모듈에서 process.env 사용 가능
    }),
    AuthModule,
    UsersModule,
    DatabaseModule,
    ESGModule,
    ChartModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
