import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types, isValidObjectId } from 'mongoose'
import { EsgChart, EsgDashboard, EsgDashboardDocument } from './esg-dashboard.schema'
import { CreateEsgDashboardDto, UpdateEsgChartDto } from './esg-dashboard.dto'
import { UpdateChartOrderBatchDto } from './update-chart-order.dto'

@Injectable()
export class EsgDashboardService {
  constructor(
    @InjectModel(EsgDashboard.name)
    private readonly esgDashboardModel: Model<EsgDashboardDocument>,
  ) {}
  //----------------------------------------------------------------------------------------------------

  // 대시보드 생성
  async create(userId: string, dto: CreateEsgDashboardDto) {
    const created = new this.esgDashboardModel({ userId, ...dto })
    return created.save()
  }
  //----------------------------------------------------------------------------------------------------

  // 대시보드 조회
  async findByUser(userId: string) {
    const dashboards = await this.esgDashboardModel.find({ userId }).lean()

    const flatCharts = dashboards.flatMap((d) =>
      d.charts.map((chart) => ({
        ...chart,
        chartId: chart._id,
        dashboardId: d._id,
        userId: d.userId,
        category: d.category,
      })),
    )

    return flatCharts
  }
  //----------------------------------------------------------------------------------------------------

  // 카테고리별 대시보드 조회
  async findByUserAndCategory(userId: string, category: string) {
    const dashboard = await this.esgDashboardModel.findOne({ userId, category }).lean()

    if (!dashboard) return []

    return dashboard.charts.map((chart) => ({
      ...chart,
      dashboardId: dashboard._id,
      category: dashboard.category,
    }))
  }
  //----------------------------------------------------------------------------------------------------

  // 대시보드에 차트 즐겨찾기 업데이트
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
  //----------------------------------------------------------------------------------------------------

  // 대시보드에 차트 순서 일괄 업데이트
  // 대시보드 ID 랑 Chart ID 로 차트 순서 변경 위젯 순서 변경
  async batchUpdateOrders(updates: UpdateChartOrderBatchDto[]) {
    const results = await Promise.all(
      updates.map(({ dashboardId, chartId, newOrder }) => {
        if (!isValidObjectId(dashboardId) || !isValidObjectId(chartId)) {
          console.warn('❌ Invalid ID:', { dashboardId, chartId })
          return { modifiedCount: 0 }
        }

        return this.esgDashboardModel.updateOne(
          {
            _id: new Types.ObjectId(dashboardId),
            'charts._id': new Types.ObjectId(chartId),
          },
          {
            $set: { 'charts.$.order': newOrder },
          },
        )
      }),
    )

    const modifiedCount = results.reduce((acc, r) => acc + r.modifiedCount, 0)

    if (modifiedCount === 0) {
      throw new NotFoundException('하나도 수정되지 않았습니다. ID 확인이 필요합니다.')
    }

    return {
      message: '차트 순서 일괄 업데이트 완료',
      updated: modifiedCount,
    }
  }
  //----------------------------------------------------------------------------------------------------

  // 차트 프론트 불러오기
  async loadChart(dashboardId: string, chartId: string, userId: string) {
    console.log('[📥 요청 도착]', { dashboardId, chartId, userId })

    const dashboard = await this.esgDashboardModel
      .findOne({
        _id: new Types.ObjectId(dashboardId),
        userId: new Types.ObjectId(userId),
        'charts._id': new Types.ObjectId(chartId),
      })
      .lean()

    if (!dashboard) {
      console.log('[❌ dashboard 못 찾음]')
      throw new NotFoundException('대시보드를 찾을 수 없습니다.')
    }

    const chart = dashboard.charts.find((c) => c._id.toString() === chartId)
    if (!chart) {
      console.log('[❌ chart 못 찾음]')
      throw new NotFoundException('차트를 찾을 수 없습니다.')
    }

    console.log('[✅ chart 찾음]', chart)
    return chart
  }
  //----------------------------------------------------------------------------------------------------

  // 대시보드에 차트 수정
  async updateChart(
    dashboardId: string,
    chartId: string,
    userId: string,
    updateDto: UpdateEsgChartDto,
  ) {
    const dashboard = await this.esgDashboardModel.findOne({
      _id: dashboardId,
      userId,
    })

    if (!dashboard) {
      throw new NotFoundException('대시보드를 찾을 수 없습니다.')
    }

    const chart = dashboard.charts.find((c) => c._id.toString() === chartId)
    if (!chart) {
      throw new NotFoundException('차트를 찾을 수 없습니다.')
    }

    Object.assign(chart, updateDto) // DTO 값을 chart에 덮어쓰기
    await dashboard.save()

    return chart
  }

  //----------------------------------------------------------------------------------------------------

  // 대시보드에서 차트 삭제
  async deleteChart(dashboardId: string, chartId: string, userId: string) {
    const dashboard = await this.esgDashboardModel.findOne({
      _id: dashboardId,
      userId: userId,
    })

    if (!dashboard) {
      throw new NotFoundException('대시보드를 찾을 수 없습니다.')
    }

    dashboard.charts = dashboard.charts.filter(
      (chart) => chart._id.toString() !== chartId.toString(),
    )

    await dashboard.save()
    return { message: '차트 삭제 성공', chartId }
  }
  //----------------------------------------------------------------------------------------------------

  async getIndicatorsWithPreviousYearData(userId: string, category: string, year: number) {
    const dashboards = await this.esgDashboardModel.find({ userId, category })
    const prevYear = year - 1

    const indicators = new Map<
      string,
      { key: string; label: string; unit: string; prevValue: number }
    >()

    dashboards.forEach((dashboard) => {
      dashboard.charts.forEach((chart) => {
        chart.fields.forEach((field) => {
          const prevValue = field.data?.[prevYear]
          if (prevValue !== undefined) {
            indicators.set(field.key, {
              key: field.key,
              label: field.label,
              unit: chart.unit ?? field.unit ?? '',
              prevValue, // ✅ 여기 추가!
            })
          }
        })
      })
    })

    return Array.from(indicators.values())
  }
  //----------------------------------------------------------------------------------------------------
}
