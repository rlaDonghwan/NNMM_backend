import { Controller, Get, Post, Body, Query } from '@nestjs/common' // NestJS의 데코레이터와 모듈 가져오기
import { IndicatorService } from './indicator.service' // IndicatorService 가져오기
import { IndicatorDocument } from './schemas/indicator.schema' // IndicatorDocument 타입 가져오기

@Controller('indicators') // 'indicators' 경로에 대한 컨트롤러 정의
export class IndicatorController {
  constructor(private readonly indicatorService: IndicatorService) {} // IndicatorService를 의존성 주입

  @Get() // HTTP GET 요청 처리
  async getAll(
    @Query('category') category?: string, // 쿼리 파라미터 'category'를 가져오기
  ): Promise<{ key: string; label: string; unit: string }[]> {
    // 카테고리 조건에 따라 지표 목록 조회
    const indicators = category
      ? await this.indicatorService.findByCategory(
          category as 'environmental' | 'social' | 'governance',
        )
      : await this.indicatorService.findAll()

    // key 변환 후 반환
    return indicators.map((ind) => ({
      key: ind.label.toLowerCase().replace(/\s+/g, '-'),
      label: ind.label,
      unit: ind.unit,
    }))
  }

  //----------------------------------------------------------------------------------------------------

  @Post() // HTTP POST 요청 처리
  async createMany(
    @Body() indicators: { label: string; unit: string; category: string }[],
  ): Promise<IndicatorDocument[]> {
    const result: IndicatorDocument[] = [] // 결과 배열 초기화

    for (const ind of indicators) {
      const existing = await this.indicatorService.findByLabel(ind.label)

      if (!existing) {
        // 기존에 없으면 새로 생성
        const created = (await this.indicatorService.create({
          ...ind,
          isActive: true,
          category: ind.category as 'environmental' | 'social' | 'governance',
        })) as IndicatorDocument
        result.push(created)
      } else {
        // 이미 존재할 경우 업데이트 여부 확인
        let updated = false

        if (existing.unit !== ind.unit) {
          existing.unit = ind.unit
          updated = true
        }

        if (existing.category !== ind.category) {
          existing.category = ind.category as 'environmental' | 'social' | 'governance'
          updated = true
        }

        if (updated) {
          await (existing as IndicatorDocument).save()
          result.push(existing as IndicatorDocument)
        }
      }
    }

    return result // 결과 반환
  }

  //----------------------------------------------------------------------------------------------------

  @Post('check-or-create') // HTTP POST - 존재 여부 확인 후 없으면 생성
  async checkOrCreate(@Body() body: { label: string; unit: string }) {
    const { label, unit } = body
    let indicator = await this.indicatorService.findByLabel(label)

    if (!indicator) {
      indicator = (await this.indicatorService.create({
        label,
        unit,
        category: 'social',
        isActive: true,
      })) as IndicatorDocument
    } else if (indicator.unit !== unit) {
      indicator.unit = unit
      indicator = await (indicator as IndicatorDocument).save()
    }

    return indicator
  }
}
