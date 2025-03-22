import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { ConfigModule } from '@nestjs/config'

@Module({
  imports: [
    ConfigModule.forRoot(), // .env 사용 가능하게
    MongooseModule.forRoot(process.env.MONGODB_URI as string), // 타입 단언으로 에러 방지
  ],
})
export class DatabaseModule {}
