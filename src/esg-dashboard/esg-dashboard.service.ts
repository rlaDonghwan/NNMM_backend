
import { Injectable, NotFoundException } from '@nestjs/common' // 의존성 주입을 위한 Injectable 데코레이터 임포트
import { InjectModel } from '@nestjs/mongoose' // Mongoose 모델 주입을 위한 데코레이터 임포트
import { Model } from 'mongoose' // Mongoose의 Model 타입 임포트
import { EsgChart, EsgDashboard, EsgDashboardDocument } from './esg-dashboard.schema' // ESG 대시보드 스키마 및 타입 임포트
import { CreateEsgDashboardDto } from './esg-dashboard.dto' // 대시보드 생성 DTO 임포트
import { UpdateEsgDashboardDto } from './UpdateEsgDashboard.dto' // 대시보드 업데이트 DTO 임포트
import { Types } from 'mongoose'
import { isValidObjectId, Model, Types } from 'mongoose'
import { CreateEsgDashboardDto, UpdateEsgChartDto } from './esg-dashboard.dto'
import { UpdateChartOrderBatchDto } from './update-chart-order.dto'

@Injectable()
export class EsgDashboardService {
  constructor(
    @InjectModel(EsgDashboard.name)
    private readonly esgDashboardModel: Model<EsgDashboardDocument>,
  ) {}
  //----------------------------------------------------------------------------------------------------
  async create(userId: string, dto: CreateEsgDashboardDto) {
    const created = new this.esgDashboardModel({ userId, ...dto })
    return created.save()
  }
  //----------------------------------------------------------------------------------------------------
  async findByUser(userId: string) {
    const dashboards = await this.esgDashboardModel.find({ userId }).lean()

    const flatCharts = dashboards.flatMap((d) =>
      d.charts.map((chart) => ({
        ...chart,
        chartId: chart._id,
        dashboardId: d._id,
        userId: d.userId,
        category: d.category,
      }))
    })
        category: d.category,
      })),
    )

    return flatCharts
  }
  //----------------------------------------------------------------------------------------------------
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
  async findDashboardById(dashboardId: string, userId: string) {
    const dashboard = await this.esgDashboardModel.findOne({ _id: dashboardId, userId }).lean()

    if (!dashboard) {
      throw new NotFoundException('해당 대시보드를 찾을 수 없습니다.')
    }

    return dashboard
  }
  //----------------------------------------------------------------------------------------------------
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
      throw new NotFoundException('해당 대시보드를 찾을 수 없습니다.')
    }

    const chart = dashboard.charts.find((chart) => chart._id.toString() === chartId)

    if (!chart) {
      throw new NotFoundException('해당 차트를 찾을 수 없습니다.')
    }

    Object.assign(chart, updateDto)

    await dashboard.save()
    return chart
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
}
