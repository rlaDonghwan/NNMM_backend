import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Chart } from './schemas/chart.schema'
import { Model } from 'mongoose'
import mongoose from 'mongoose'
import { CreateChartDto } from './chart.dto'

@Injectable()
export class ChartService {
  constructor(
    @InjectModel(Chart.name)
    private readonly chartModel: Model<Chart>,
  ) {}

  // CreateChartDto 타입을 인자로 받아 Promise<Chart> 타입을 반환하는 메서드
  async createChart(createChartDto: CreateChartDto): Promise<Chart> {
    const created = new this.chartModel({
      ...createChartDto,
      userId: new mongoose.Types.ObjectId(createChartDto.userId),
    })
    return created.save()
  }
  //----------------------------------------------------------------------------------------------------

  async createDefaultConfig(userId: string, category: string, indicatorKey: string) {
    return this.chartModel.create({
      userId,
      category,
      indicatorKey,
      chartType: 'bar',
      title: `${indicatorKey}`,
      colors: ['#88CCE6'],
      xField: 'year',
      yField: 'value',
    })
  }
}
