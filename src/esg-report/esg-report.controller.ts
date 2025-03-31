import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common' // NestJS 데코레이터 및 모듈 import
import { AuthGuard } from '@nestjs/passport' // JWT 인증을 위한 AuthGuard import
import { Request } from 'express' // Express Request 타입 import
import { CreateEsgReportDto } from './esg-report.dto' // DTO 타입 import
import { EsgReportService } from './esg-report.service' // ESGReport 서비스 import

@Controller('esg-report') // 컨트롤러의 기본 라우트 경로 설정
export class EsgReportController {
  constructor(private readonly esgReportService: EsgReportService) {} // ESGReportService를 의존성 주입

  @Post() // POST 요청 처리 핸들러
  @UseGuards(AuthGuard('jwt')) // JWT 인증이 필요한 요청으로 설정
  async createReport(@Req() req: Request, @Body() dto: CreateEsgReportDto) {
    const user = req.user as any // 인증된 사용자 정보 가져오기
    return this.esgReportService.create({
      ...dto, // 클라이언트로부터 받은 DTO 그대로 전달
      userId: user._id.toString(), // 사용자 ID를 추가하여 서비스에 전달
    })
  }
}
