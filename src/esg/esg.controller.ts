// src/esg/esg.controller.ts
import { Body, Controller, Post } from '@nestjs/common'
import { ESGService } from './esg.service'
import { CreateEsgDto } from '@/esg/esg.dto'

@Controller('esg')
export class ESGController {
  constructor(private readonly esgService: ESGService) {}

  // 프론트에서 보낸 데이터를 받아서 create 메소드를 실행
  @Post()
  async createEsg(@Body() body: CreateEsgDto) {
    return this.esgService.create(body)
  }
  //----------------------------------------------------------------------------------------------------
}
