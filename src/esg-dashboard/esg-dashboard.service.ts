import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { EsgDashboard, EsgDashboardDocument } from './esg-dashboard.schema'
import { CreateEsgDashboardDto } from './esg-dashboard.dto'

@Injectable()
export class EsgDashboardService {
  constructor(
    @InjectModel(EsgDashboard.name)
    private readonly esgDashboardModel: Model<EsgDashboardDocument>,
  ) {}

  async create(userId: string, dto: CreateEsgDashboardDto) {
    const created = new this.esgDashboardModel({
      userId,
      ...dto,
    })
    return created.save()
  }

  async findByUser(userId: string) {
    const dashboards = await this.esgDashboardModel.find({ userId }).lean()

    // charts 배열을 펼쳐서 각 chart에 category, _id 등 상위 속성 붙이기
    const flatCharts = dashboards.flatMap((d) => {
      return d.charts.map((chart) => ({
        ...chart,
        _id: d._id, // 사용자가 식별할 수 있도록 상위 ID 유지
        category: d.category,
      }))
    })

    return flatCharts
  }

  async findByUserAndCategory(userId: string, category: string) {
    return this.esgDashboardModel.findOne({ userId, category }).exec()
  }

  async deleteById(id: string) {
    return this.esgDashboardModel.findByIdAndDelete(id).exec()
  }
}
