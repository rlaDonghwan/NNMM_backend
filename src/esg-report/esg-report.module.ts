import { MongooseModule } from '@nestjs/mongoose'
import { Module } from '@nestjs/common'
import { EsgReportService } from './esg-report.service'
import { EsgReportController } from './esg-report.controller'
import { ESGReport, ESGReportSchema } from './esg-report.schemas'
import { User, UserSchema } from '../users/schemas/user.schema' // ✅ 추가

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'ESGReport', schema: ESGReportSchema },
      { name: 'User', schema: UserSchema }, // ✅ 요거!
    ]),
  ],
  controllers: [EsgReportController],
  providers: [EsgReportService],
  exports: [EsgReportService],
})
export class EsgReportModule {}
