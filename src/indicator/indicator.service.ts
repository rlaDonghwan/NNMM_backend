// src/indicators/indicator.service.ts
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Indicator, IndicatorDocument } from './schemas/indicator.schema'

@Injectable()
export class IndicatorService {
  constructor(@InjectModel(Indicator.name) private indicatorModel: Model<IndicatorDocument>) {}

  async findAll(): Promise<Indicator[]> {
    return this.indicatorModel.find({ isActive: true }).exec()
  }

  async create(data: Partial<Indicator>): Promise<Indicator> {
    return this.indicatorModel.create(data)
  }
}
