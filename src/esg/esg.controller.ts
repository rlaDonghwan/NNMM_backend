// src/esg/esg.controller.ts
import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common'
import { ESGService } from './esg.service'
import { CreateESGDto } from '@/esg/esg.dto'
import { Request } from 'express'
import { AuthGuard } from '@nestjs/passport'

@Controller('esg')
export class ESGController {
  constructor(private readonly esgService: ESGService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(@Body() dto: Omit<CreateESGDto, 'userId'>, @Req() req: Request) {
    const user = req.user as any // ✅ JwtStrategy에서 리턴한 사용자 정보
    console.log('✅ Received ESG data:', dto)
    console.log('👤 인증된 사용자:', user)

    return this.esgService.createWithIndicatorCheck({
      ...dto,
      userId: user._id.toString(), // ✅ userId 자동 주입
    })
  }
}
