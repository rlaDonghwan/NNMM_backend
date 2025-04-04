import { Body, Controller, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common' // NestJS의 데코레이터 및 요청 관련 유틸 가져오기
import { EsgDashboardService } from './esg-dashboard.service' // ESG 대시보드 서비스 임포트
import { CreateEsgDashboardDto, UpdateEsgChartDto } from './esg-dashboard.dto' // ESG 대시보드 생성 DTO 임포트
import { JwtAuthGuard } from '@/auth/jwt/jwt.guard' // JWT 인증 가드 임포트
import { Request } from 'express' // Express의 Request 타입 임포트
import { Types } from 'mongoose'

import { UpdateChartOrderBatchDto } from './update-chart-order.dto'

@Controller('esg-dashboard') // 이 컨트롤러는 '/esg-dashboard' 경로에 매핑
@UseGuards(JwtAuthGuard) // 모든 라우트에 JWT 인증 가드 적용 (로그인한 사용자만 접근 가능)
export class EsgDashboardController {
  constructor(private readonly esgDashboardService: EsgDashboardService) {} // 서비스 의존성 주입
  //----------------------------------------------------------------------------------------------------
  @Post() // POST 요청 처리 (대시보드 생성)
  async create(@Req() req: Request, @Body() dto: CreateEsgDashboardDto) {
    const user = req.user as { _id: string } // 요청에서 사용자 ID 추출
    return this.esgDashboardService.create(user._id, dto) // 서비스에 생성 요청
  }
  //----------------------------------------------------------------------------------------------------
  @Get() // GET 요청 처리 (해당 사용자의 모든 대시보드 조회)
  async getAllByUser(@Req() req: Request) {
    const user = req.user as { _id: string } // 요청에서 사용자 ID 추출
    return this.esgDashboardService.findByUser(user._id) // 사용자 ID로 대시보드 조회
  }
  //----------------------------------------------------------------------------------------------------
  @Get('by-category') // GET 요청 처리 (카테고리별 대시보드 조회)
  async getByCategory(@Req() req: Request, @Query('category') category: string) {
    const user = req.user as { _id: string } // 요청에서 사용자 ID 추출
    return this.esgDashboardService.findByUserAndCategory(user._id, category) // 사용자 ID와 카테고리로 필터링하여 조회
  }
  //----------------------------------------------------------------------------------------------------
  //favorite사용하기 위해 추가했습니당 patch이용해서 chartid, dashboardid, userid 받습니다
  @Patch('favorite/:dashboardId')
  async updateChartFavorite(
    @Param('dashboardId') dashboardId: string,
    @Body() body: { chartId: string; isFavorite: boolean; userId: string },
  ) {
    const userId = body.userId
    return this.esgDashboardService.updateChartFavorite(
      dashboardId,
      body.chartId,
      body.userId,
      body.isFavorite,
    )
  }
  //----------------------------------------------------------------------------------------------------
  @Patch('batch-update-orders') // 대시보드 ID 랑 Chart ID 로 차트 순서 변경 위젯 순서 변경
  async batchUpdateOrders(@Body() updates: UpdateChartOrderBatchDto[]) {
    return this.esgDashboardService.batchUpdateOrders(updates)
  }
  //----------------------------------------------------------------------------------------------------

  @Patch('load-chart') // 차트 로드
  async updateChartFormBody(
    @Body() body: { dashboard: string; chartId: string },
    @Req() req: Request,
  ) {
    const user = req.user as { _id: string }
    return this.esgDashboardService.loadChart(body.dashboard, body.chartId, user._id)
  }
  //----------------------------------------------------------------------------------------------------

  @Patch('update-chart')
  async updateChartFromBody(
    @Body()
    body: {
      dashboardId: string
      chartId: string
      updateDto: UpdateEsgChartDto
    },
    @Req() req: Request,
  ) {
    const user = req.user as { _id: string }
    return this.esgDashboardService.updateChart(
      body.dashboardId,
      body.chartId,
      user._id,
      body.updateDto,
    )
  }

  //----------------------------------------------------------------------------------------------------

  @Patch('delete-chart')
  async deleteChart(
    @Body()
    body: {
      dashboardId: string
      chartId: string
    },
    @Req() req: Request,
  ) {
    const user = req.user as { _id: string }
    return this.esgDashboardService.deleteChart(body.dashboardId, body.chartId, user._id)
  }
  //
}
