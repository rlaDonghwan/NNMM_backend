import { Body, Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common'
import { ChartConfigService } from './chart-config.service'
import { JwtAuthGuard } from '@/auth/jwt/jwt.guard'
import { CreateChartDto } from './chart-config.dto'

@Controller('chart') // 'chart' 경로에 대한 컨트롤러를 정의
export class ChartConfigController {
  constructor(private readonly chartConfigService: ChartConfigService) {} // ChartConfigService를 의존성 주입

  @Post('order') // HTTP POST 요청을 처리하는 핸들러로 지정
  async updateOrder(@Body('orderedIds') orderedIds: string[]) {
    console.log('[POST/chart/order] orderlists:', orderedIds)
    return this.chartConfigService.updateChartOrder(orderedIds)
  }
  @UseGuards(JwtAuthGuard) // JwtAuthGuard를 사용하여 인증된 요청만 처리
  async create(@Req() req, @Body() dto: CreateChartDto) {
    // 요청 객체(req)와 요청 본문(dto)을 매개변수로 받음
    return this.chartConfigService.createChart({ ...dto, userId: req.user._id })
    // ChartConfigService의 createChart 메서드를 호출하며, 요청 본문과 사용자 ID를 전달
  }
  //----------------------------------------------------------------------------------------------------

  @Get()
  // async getChartsByUser(@Query('userId')userId:string) {
  //   return this.chartConfigService.findChartsByUser(userId)
  // }
  @UseGuards(JwtAuthGuard)
  async getChartsByUser(@Req() req) {
    console.log('[GET /chart] userId:', req.user?._id)
    const charts = await this.chartConfigService.findChartsByUser(req.user._id)
    console.log('[GET /chart] charts.length:', charts.length)
    return charts
  }
  //----------------------------------------------------------------------------------------------------
}
