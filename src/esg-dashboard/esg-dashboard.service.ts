import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types, isValidObjectId } from 'mongoose'
import { EsgChart, EsgDashboard, EsgDashboardDocument } from './esg-dashboard.schema'
import { CreateEsgDashboardDto, UpdateEsgChartDto } from './esg-dashboard.dto'
import { UpdateChartOrderBatchDto } from './update-chart-order.dto'

@Injectable()
export class EsgDashboardService {
  updateChart(dashboardId: string, chartId: string, _id: string, updateDto: UpdateEsgChartDto) {
    throw new Error('Method not implemented.')
  }
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

  // async findDashboardById(dashboardId: string, userId: string) {
  //   const dashboard = await this.esgDashboardModel.findOne({ _id: dashboardId, userId }).lean()

  //   if (!dashboard) {
  //     throw new NotFoundException('해당 대시보드를 찾을 수 없습니다.')
  //   }

  //   return dashboard
  // }
  // //----------------------------------------------------------------------------------------------------
  // async updateChart(
  //   dashboardId: string,
  //   chartId: string,
  //   userId: string,
  //   updateDto: UpdateEsgChartDto,
  // ) {
  //   const dashboard = await this.esgDashboardModel.findOne({
  //     _id: dashboardId,
  //     userId,
  //   })

  //   if (!dashboard) {
  //     throw new NotFoundException('해당 대시보드를 찾을 수 없습니다.')
  //   }

  //   const chart = dashboard.charts.find((chart) => chart._id.toString() === chartId)

  //   if (!chart) {
  //     throw new NotFoundException('해당 차트를 찾을 수 없습니다.')
  //   }

  //   Object.assign(chart, updateDto)

  //   await dashboard.save()
  //   return chart
  // }
  async updateChartByBody(
    userId: string,
    body: {
      dashboardId: string
      chartId: string
      updateDto: UpdateEsgChartDto
    },
  ) {
    const { dashboardId, chartId, updateDto } = body

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

  async loadChart(dashboardId: string, chartId: string, userId: string) {
    console.log('[📥 요청 도착]', { dashboardId, chartId, userId })

    const dashboard = await this.esgDashboardModel
      .findOne({
        _id: new Types.ObjectId(dashboardId), // ✅ 꼭 ObjectId로 변환
        userId: new Types.ObjectId(userId),
        'charts._id': new Types.ObjectId(chartId), // ✅ 이것도!
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
}
