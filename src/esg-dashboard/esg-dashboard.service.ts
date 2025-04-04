import { Injectable, NotFoundException } from '@nestjs/common' // 의존성 주입을 위한 Injectable 데코레이터 임포트
import { InjectModel } from '@nestjs/mongoose' // Mongoose 모델 주입을 위한 데코레이터 임포트
import { Model } from 'mongoose' // Mongoose의 Model 타입 임포트
import { EsgChart, EsgDashboard, EsgDashboardDocument } from './esg-dashboard.schema' // ESG 대시보드 스키마 및 타입 임포트
import { CreateEsgDashboardDto } from './esg-dashboard.dto' // 대시보드 생성 DTO 임포트
import { UpdateEsgDashboardDto } from './UpdateEsgDashboard.dto' // 대시보드 업데이트 DTO 임포트
import { Types } from 'mongoose'

@Injectable() // 서비스 클래스로 선언 (의존성 주입 가능)
export class EsgDashboardService {
  constructor(
    @InjectModel(EsgDashboard.name) // EsgDashboard 모델을 주입
    private readonly esgDashboardModel: Model<EsgDashboardDocument>, // Mongoose 모델 타입으로 선언
  ) {}

  async create(userId: string, dto: CreateEsgDashboardDto) {
    // 새 ESG 대시보드 생성 (userId와 DTO 값 포함)
    const created = new this.esgDashboardModel({
      userId,
      ...dto,
    })
    return created.save() // MongoDB에 저장
  }
  //----------------------------------------------------------------------------------------------------

  async findByUser(userId: string) {
    // 해당 사용자(userId)의 모든 대시보드 조회 (lean()으로 plain object로 반환)
    const dashboards = await this.esgDashboardModel.find({ userId }).lean()

    // charts 배열을 펼쳐서(flatMap) 각 chart에 상위 속성(_id, category) 추가
    const flatCharts = dashboards.flatMap((d) => {
      return d.charts.map((chart) => ({
        chartId: chart._id,
        dashboardId: d._id,
        userId: d.userId,
        category: d.category,
      }))
    })

    return flatCharts // 펼쳐진 차트 목록 반환
  }
  //----------------------------------------------------------------------------------------------------

  async findByUserAndCategory(userId: string, category: string) {
    // 사용자 ID와 카테고리를 기준으로 단일 대시보드 문서 조회
    return this.esgDashboardModel.findOne({ userId, category }).exec()
  }
  //----------------------------------------------------------------------------------------------------

  async update(id: string, userId: string, updateDto: UpdateEsgDashboardDto) {
    const existing = await this.esgDashboardModel.findOne({ _id: id, userId })
    if (!existing) {
      throw new NotFoundException('해당 차트를 찾을 수 없습니다.')
    }

    Object.assign(existing, updateDto)
    return existing.save()
  }
  //----------------------------------------------------------------------------------------------------

  async delete(id: string, userId: string) {
    const result = await this.esgDashboardModel.deleteOne({ _id: id, userId })
    if (result.deletedCount === 0) {
      throw new NotFoundException('삭제할 차트를 찾을 수 없습니다.')
    }
    return { message: '삭제되었습니다.' }
  }

  //----------------------------------------------------------------------------------------------------

  async updateChartOrders(userId: string, updatedCharts: { id: string; order: number }[]) {
    const dashboards = await this.esgDashboardModel.find({ userId })

    for (const dashboard of dashboards) {
      const chartMap = new Map(updatedCharts.map((c) => [c.id, c.order]))
      let modified = false

      const reordered = dashboard.charts
        .slice()
        .sort((a, b) => {
          const orderA = chartMap.get(String((a as any)._id)) ?? a.order
          const orderB = chartMap.get(String((b as any)._id)) ?? b.order
          return orderA - orderB
        })
        .map((chart, index) => {
          const newOrder = index + 1
          modified = true
          return { ...chart, order: newOrder } // ✅ 안전하게 복사
        })

      dashboard.charts = reordered

      if (modified) {
        await dashboard.save()
      }
    }

    return { success: true }
  }
  //----------------------------------------------------------------------------------------------------
  async updateChartFavorite(
    dashboardId: string,
    chartId: string,
    userId: string,
    isFavorite: boolean,
  ) {
    const dashboard = await this.esgDashboardModel.findOne({
      _id: dashboardId,
      userId: new Types.ObjectId(userId),
    })

    if (!dashboard) {
      throw new NotFoundException('해당 대시보드를 찾을 수 없습니다.')
    }

    const chart = dashboard.charts.find((c: any) => String(c._id) === String(chartId))

    if (!chart) {
      throw new NotFoundException('해당 차트를 찾을 수 없습니다.')
    }

    chart.isFavorite = isFavorite
    await dashboard.save()

    return { success: true, chartId, isFavorite }
  }
}
