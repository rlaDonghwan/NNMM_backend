import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { EsgGoal } from './esg-goal.schema'
import { CreateEsgGoalDto } from './CreateOrUpdateGoalDto'

@Injectable()
export class EsgGoalService {
  constructor(@InjectModel(EsgGoal.name) private readonly esgGoalModel: Model<EsgGoal>) {}

  async createGoal(dto: CreateEsgGoalDto & { userId: string }) {
    const exists = await this.esgGoalModel.findOne({
      userId: dto.userId,
      indicatorKey: dto.indicatorKey,
      category: dto.category,
    })

    if (exists) {
      await this.esgGoalModel.updateOne(
        { _id: exists._id },
        { $set: { targetValue: dto.targetValue, unit: dto.unit } },
      )
      return { message: '기존 목표를 업데이트했습니다.' }
    }

    const created = new this.esgGoalModel(dto)
    return created.save()
  }

  async getGoalsByCategory(userId: string, category: string) {
    return this.esgGoalModel.find({ userId, category })
  }
}
