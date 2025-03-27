import { Body, Controller, Post } from '@nestjs/common'
import { ChartService } from './chart.service'
import { CreateChartDto } from './chart.dto'

@Controller('chart')
export class ChartController {
  constructor(private readonly chartService: ChartService) {}

  @Post() // HTTP POST 요청을 처리하는 데 사용되는 데코레이터
  async createChart(@Body() body: CreateChartDto) {
    // 요청의 body를 CreateChartDto 타입으로 매핑
    return this.chartService.createChart(body) // ChartService의 createChart 메서드를 호출하여 처리 결과 반환
  }
  //----------------------------------------------------------------------------------------------------
}
