import { MongooseModule } from '@nestjs/mongoose' // Mongoose 연동을 위한 모듈
import { Module } from '@nestjs/common' // NestJS 모듈 데코레이터
import { EsgReportService } from './esg-report.service' // 서비스 import
import { EsgReportController } from './esg-report.controller' // 컨트롤러 import
import { ESGReport, ESGReportSchema } from './esg-report.schemas' // 스키마 import
import { User, UserSchema } from '../users/schemas/user.schema' // 사용자 스키마 import

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'ESGReport', schema: ESGReportSchema }, // ESGReport 모델 등록
      { name: 'User', schema: UserSchema }, // User 모델 등록
    ]),
  ],
  controllers: [EsgReportController], // 컨트롤러 등록
  providers: [EsgReportService], // 서비스 등록
  exports: [EsgReportService], // 외부 모듈에서 사용할 수 있도록 export
})
export class EsgReportModule {} // EsgReport 모듈 정의
