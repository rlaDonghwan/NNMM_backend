import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { EsgDashboardController } from './esg-dashboard.controller'
import { EsgDashboardService } from './esg-dashboard.service'
import { EsgDashboard, EsgDashboardSchema } from './esg-dashboard.schema'

@Module({
  imports: [MongooseModule.forFeature([{ name: EsgDashboard.name, schema: EsgDashboardSchema }])],
  controllers: [EsgDashboardController],
  providers: [EsgDashboardService],
})
export class EsgDashboardModule {}
