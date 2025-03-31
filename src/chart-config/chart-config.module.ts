import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { ChartService } from './chart.service'
import { ChartController } from './chart.controller'
import { Chart, ChartSchema } from './schemas/chart.schema'

@Module({
  imports: [MongooseModule.forFeature([{ name: Chart.name, schema: ChartSchema }])],
  providers: [ChartService],
  controllers: [ChartController],
  exports: [ChartService], // 다른 모듈에서 쓸 수도 있도록
})
export class ChartModule {}
