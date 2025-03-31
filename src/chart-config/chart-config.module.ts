// chart-config.module.ts
import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { ChartConfigService } from './chart-config.service'
import { ChartConfigController } from './chart-config.controller'
import { Chart, ChartConfigSchema } from './chart-config.schema'

@Module({
  // MongooseModule을 사용하여 Chart 모델과 ChartConfigSchema를 등록
  imports: [MongooseModule.forFeature([{ name: Chart.name, schema: ChartConfigSchema }])],
  // ChartConfigService를 이 모듈의 provider로 등록
  providers: [ChartConfigService],
  // ChartConfigController를 이 모듈의 controller로 등록
  controllers: [ChartConfigController],
  // ChartConfigService를 다른 모듈에서 사용할 수 있도록 export
  exports: [ChartConfigService],
})
// ChartConfigModule 클래스를 모듈로 정의
export class ChartConfigModule {}
