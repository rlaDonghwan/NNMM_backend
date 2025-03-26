// src/indicators/indicator.controller.ts
import { Controller, Get, Post, Body } from '@nestjs/common'
import { IndicatorService } from './indicator.service'
import { Indicator } from './schemas/indicator.schema'

@Controller('indicators')
export class IndicatorController {
  constructor(private readonly indicatorService: IndicatorService) {}

  @Get()
  getAll(): Promise<Indicator[]> {
    return this.indicatorService.findAll()
  }

  @Post()
  create(@Body() body: Partial<Indicator>): Promise<Indicator> {
    return this.indicatorService.create(body)
  }
}
