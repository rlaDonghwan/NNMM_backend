import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { Request } from 'express'
import { CreateEsgReportDto } from './esg-report.dto'
import { EsgReportService } from './esg-report.service'

@Controller('esg-report')
export class EsgReportController {
  constructor(private readonly esgReportService: EsgReportService) {} // ✅ 서비스 주입

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async createReport(@Req() req: Request, @Body() dto: CreateEsgReportDto) {
    const user = req.user as any
    return this.esgReportService.create({
      ...dto,
      userId: user._id.toString(), // ✅ userId 맞게 넘기기
    })
  }
}
