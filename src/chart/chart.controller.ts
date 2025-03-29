import { Body, Controller, Post } from '@nestjs/common'
import { ChartService } from './chart.service'
import { CreateChartDto } from './chart.dto'

@Controller('chart')
export class ChartController {
  constructor(private readonly chartService: ChartService) {}

  @Post('config')
  async createDefaultChart(@Body() body: any) {
    const { userId, category, indicatorKey } = body
    return this.chartService.createDefaultConfig(userId, category, indicatorKey)
  }

  //----------------------------------------------------------------------------------------------------
}
