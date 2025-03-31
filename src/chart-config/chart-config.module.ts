import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { ChartConfigService } from './chart-config.service'
import { ChartConfigController } from './chart-config.controller'
import { Chart, ChartConfigSchema } from './schemas/chart-config.schema'

@Module({
  imports: [MongooseModule.forFeature([{ name: Chart.name, schema: ChartConfigSchema }])],
  providers: [ChartConfigService],
  controllers: [ChartConfigController],
  exports: [ChartConfigService], // 다른 모듈에서 쓸 수도 있도록
})
export class ChartConfigModule {}
