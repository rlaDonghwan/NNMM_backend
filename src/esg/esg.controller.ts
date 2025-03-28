import { Body, Controller, Post } from '@nestjs/common'
import { ESGService } from './esg.service'
import { CreateESGDto } from '@/esg/esg.dto'

@Controller('esg')
export class ESGController {
  constructor(private readonly esgService: ESGService) {}

  // 프론트에서 보낸 데이터를 받아서 create 메소드를 실행
  @Post()
  async create(@Body() dto: CreateESGDto) {
    console.log('Received ESG data:', dto) // 수신된 데이터 로그 출력
    return this.esgService.createWithIndicatorCheck(dto)
  }
  //----------------------------------------------------------------------------------------------------
}
