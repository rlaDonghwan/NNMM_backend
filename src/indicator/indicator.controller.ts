import { Controller, Get, Post, Body, Query, Param } from '@nestjs/common' // NestJS의 데코레이터와 모듈 가져오기
import { IndicatorService } from './indicator.service' // IndicatorService 가져오기
import { IndicatorDocument } from './indicator.schema' // IndicatorDocument 타입 가져오기

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

  @Post() // HTTP POST 요청 처리 이거 지금 안씀
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

  @Post(':category/check-or-create') // 이것도 지금 안씀
  async checkOrCreate(
    @Param('category') categoryParam: string,
    @Body() body: { label: string; unit: string; group?: string },
  ) {
    const { label, unit, group = '기타' } = body

    const validCategories = ['social', 'environmental', 'governance'] as const
    const category = validCategories.includes(categoryParam as any)
      ? (categoryParam as (typeof validCategories)[number])
      : 'social'

    let indicator = await this.indicatorService.findByLabelAndCategory(label, category)

    if (!indicator) {
      indicator = await this.indicatorService.create({
        label,
        unit,
        group,
        category,
        isActive: true,
      })
    }

    return indicator
  }
  //----------------------------------------------------------------------------------------------------
}
