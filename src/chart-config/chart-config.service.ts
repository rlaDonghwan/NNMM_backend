import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Chart } from './schemas/chart-config.schema'
import { Model } from 'mongoose'
import mongoose from 'mongoose'
import { CreateChartDto } from './chart-config.dto'

@Injectable()
export class ChartConfigService {
  constructor(
    @InjectModel(Chart.name)
    private readonly chartModel: Model<Chart>,
  ) {}

  /**
   * 사용자 커스텀 차트 생성
   * - userId, colorSet, labels 등의 기본값 설정 포함
   */
  async createChart(createChartDto: CreateChartDto & { userId: string }): Promise<Chart> {
    const created = new this.chartModel({
      ...createChartDto,
      userId: new mongoose.Types.ObjectId(createChartDto.userId), // userId를 ObjectId로 변환
      colorSet: createChartDto.colorSet ?? ['#3BAFDA'], // 색상 기본값 설정
      labels: createChartDto.labels ?? createChartDto.targetDataKeys, // 라벨이 없을 경우 키로 대체
    })
    return created.save() // MongoDB에 저장
  }

  /**
   * 자동 추천 차트 생성 (간단한 기본 구성)
   * - 사용자 ID, 카테고리, 지표 키, 라벨을 받아 기본 bar 차트 생성
   */
  async createDefaultConfig(userId: string, category: string, indicatorKey: string, label: string) {
    return this.chartModel.create({
      userId: new mongoose.Types.ObjectId(userId),
      companyName: '', // 기본 회사명 없음
      chartType: 'bar', // 기본 차트 유형
      category,
      indicatorKey,
      targetDataKeys: [indicatorKey],
      labels: [label],
      colorSet: ['#3BAFDA'], // 기본 색상
    })
  }

  /**
   * 차트 유형 추천 함수
   * - 입력된 지표 키와 연도 정보를 기반으로 적절한 차트 유형을 추천
   */
  recommendChartType(data: { targetDataKeys: string[]; years?: number[] }) {
    const keys = data.targetDataKeys
    const years = data.years ?? []

    const isSingleKey = keys.length === 1
    const isMultiKey = keys.length > 1
    const isMultiYear = years.length > 1

    const result: string[] = []

    if (isSingleKey) {
      result.push('line', 'bar') // 단일 키일 경우 선형 및 막대 차트 추천
    }
    if (isMultiKey) {
      result.push('bar', 'pie') // 여러 키일 경우 막대 및 파이 차트 추천
    }
    if (isMultiYear && isMultiKey) {
      result.push('stackedBar', 'groupedBar') // 여러 해 + 여러 키일 경우 스택/그룹 막대 차트 추천
    }
    if (isSingleKey && isMultiYear) {
      result.push('bar') // 단일 키 + 여러 해의 경우 막대 차트 추천
    }

    return {
      recommended: result, // 추천 차트 유형 리스트
      default: result[0] ?? 'bar', // 기본 차트 유형 (없으면 bar)
    }
  }
}
