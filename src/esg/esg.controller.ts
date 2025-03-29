import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common'
import { ESGService } from './esg.service'
import { CreateESGDto } from '@/esg/esg.dto'
import { Request } from 'express'
import { AuthGuard } from '@nestjs/passport'

@Controller('esg')
export class ESGController {
  constructor(private readonly esgService: ESGService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async create(@Body() dto: Omit<CreateESGDto, 'userId'>, @Req() req: Request) {
    const user = req.user as any
    return this.esgService.createWithIndicatorCheck({
      ...dto,
      userId: user._id.toString(),
    })
  }
}
