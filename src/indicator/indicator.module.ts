// src/indicators/indicator.module.ts
import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { Indicator, IndicatorSchema } from './indicator.schema'
import { IndicatorService } from './indicator.service'
import { IndicatorController } from './indicator.controller'

@Module({
  imports: [MongooseModule.forFeature([{ name: Indicator.name, schema: IndicatorSchema }])],
  providers: [IndicatorService],
  controllers: [IndicatorController],
  exports: [IndicatorService],
})
export class IndicatorModule {}
