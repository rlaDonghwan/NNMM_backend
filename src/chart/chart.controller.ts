import { Body, Controller, Post } from '@nestjs/common'
import { ChartService } from './chart.service'
import { CreateChartDto } from './chart.dto'

@Controller('chart')
export class ChartController {
  constructor(private readonly chartService: ChartService) {}

  @Post()
  async createChart(@Body() body: CreateChartDto) {
    return this.chartService.createChart(body)
  }
}
