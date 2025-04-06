import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { EsgGoal } from './esg-goal.schema'
import { CreateEsgGoalDto } from './CreateOrUpdateGoalDto'

@Injectable()
export class EsgGoalService {
  constructor(
    @InjectModel(EsgGoal.name)
    private readonly esgGoalModel: Model<EsgGoal>,
  ) {}

  async createGoal(dto: CreateEsgGoalDto & { userId: string }) {
    const results: { indicatorKey: string; status: string }[] = []

    for (const goal of dto.goals) {
      const exists = await this.esgGoalModel.findOne({
        userId: dto.userId,
        indicatorKey: goal.indicatorKey,
        category: dto.category,
      })

      if (exists) {
        await this.esgGoalModel.updateOne(
          { _id: exists._id },
          {
            $set: {
              targetValue: goal.targetValue,
              unit: goal.unit,
            },
          },
        )
        results.push({ indicatorKey: goal.indicatorKey, status: 'updated' })
      } else {
        const created = new this.esgGoalModel({
          ...goal,
          category: dto.category,
          userId: dto.userId,
        })
        await created.save()
        results.push({ indicatorKey: goal.indicatorKey, status: 'created' })
      }
    }

    return {
      message: '목표값 저장 완료',
      results,
    }
  }
  //----------------------------------------------------------------------------------------------------

  async getGoalsByCategory(userId: string, category: string) {
    return this.esgGoalModel.find({ userId, category })
  }
  //----------------------------------------------------------------------------------------------------

  async deleteGoal(userId: string, indicatorKey: string, category: string) {
    return this.esgGoalModel.deleteOne({ userId, indicatorKey, category })
  }
  //----------------------------------------------------------------------------------------------------
}
