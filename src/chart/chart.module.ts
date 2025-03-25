import { Module } from '@nestjs/common'
import { ChartController } from './chart.controller'
import { ChartService } from './chart.service'
import { MongooseModule } from '@nestjs/mongoose'
import { Chart, ChartSchema } from './schemas/chart.schema'

@Module({
  imports: [MongooseModule.forFeature([{ name: Chart.name, schema: ChartSchema }])],
  controllers: [ChartController],
  providers: [ChartService],
})
export class ChartModule {}
