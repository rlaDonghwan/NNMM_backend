import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { ConfigModule, ConfigService } from '@nestjs/config'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // ✅ 모든 모듈에서 .env 사용 가능
    }),

    // ✅ ConfigService로 환경 변수 안전하게 주입
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'), // .env에서 안전하게 가져오기
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
