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

  async createChart(createChartDto: CreateChartDto): Promise<Chart> {
    const created = new this.chartModel({
      ...createChartDto,
      userId: new mongoose.Types.ObjectId(createChartDto.userId),
    })
    return created.save()
  }
}
