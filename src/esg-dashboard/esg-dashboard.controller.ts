import { Body, Controller, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common' // NestJS의 데코레이터 및 요청 관련 유틸 가져오기
import { EsgDashboardService } from './esg-dashboard.service' // ESG 대시보드 서비스 임포트
import { CreateEsgDashboardDto, UpdateEsgChartDto } from './esg-dashboard.dto' // ESG 대시보드 생성 DTO 임포트
import { JwtAuthGuard } from '@/auth/jwt/jwt.guard' // JWT 인증 가드 임포트
import { Request } from 'express' // Express의 Request 타입 임포트

@Controller('esg-dashboard') // 이 컨트롤러는 '/esg-dashboard' 경로에 매핑됨
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
  @Get(':dashboardId') // GET 요청 처리 (특정 대시보드 조회)
  async getDashboardById(@Param('dashboardId') dashboardId: string, @Req() req: Request) {
    const user = req.user as { _id: string }
    return this.esgDashboardService.findDashboardById(dashboardId, user._id)
  }
  //----------------------------------------------------------------------------------------------------
  @Patch(':dashboardId/charts/:chartId')
  async updateChart(
    @Param('dashboardId') dashboardId: string,
    @Param('chartId') chartId: string,
    @Body() updateDto: UpdateEsgChartDto,
    @Req() req: Request,
  ) {
    const user = req.user as { _id: string }
    return this.esgDashboardService.updateChart(dashboardId, chartId, user._id, updateDto)
  }
}
