import { Body, Controller, Post, UseGuards, Req } from '@nestjs/common'
import { ChartService } from './chart.service'
import { CreateChartDto, RecommendChartDto } from './chart.dto'
import { JwtAuthGuard } from '../auth/jwt/jwt.guard'

@Controller('chart')
export class ChartController {
  constructor(private readonly chartService: ChartService) {}

  // 기본 차트 설정 생성 (지표 단위)
  @Post('config')
  async createDefaultChart(
    @Body() body: { userId: string; category: string; indicatorKey: string; label: string },
  ) {
    const { userId, category, indicatorKey, label } = body
    return this.chartService.createDefaultConfig(userId, category, indicatorKey, label)
  }

  // 사용자 커스텀 차트 생성 (저장)
  @UseGuards(JwtAuthGuard)
  @Post()
  async createChart(@Req() req, @Body() dto: CreateChartDto) {
    const userId = req.user._id
    return this.chartService.createChart({ ...dto, userId })
  }

  // 추천 차트 판단
  @Post('recommend')
  recommend(@Body() body: RecommendChartDto) {
    return this.chartService.recommendChartType(body)
  }

  // 추천 차트를 저장
  @UseGuards(JwtAuthGuard)
  @Post('recommend/save')
  saveRecommendedChart(@Req() req, @Body() dto: CreateChartDto) {
    const userId = req.user._id
    return this.chartService.createChart({ ...dto, userId })
  }
}
