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
  //----------------------------------------------------------------------------------------------------

  async createGoal(dto: CreateEsgGoalDto & { userId: string }) {
    const results: { indicatorKey: string; year: number; status: string }[] = []

    for (const goal of dto.goals) {
      const exists = await this.esgGoalModel.findOne({
        userId: dto.userId,
        indicatorKey: goal.indicatorKey,
        category: dto.category,
        year: goal.year,
      })

      if (exists) {
        await this.esgGoalModel.updateOne(
          { _id: exists._id },
          {
            $set: {
              targetValue: goal.targetValue,
              currentValue: goal.currentValue,
              unit: goal.unit,
            },
          },
        )
        results.push({ indicatorKey: goal.indicatorKey, year: goal.year, status: 'updated' })
      } else {
        const created = new this.esgGoalModel({
          ...goal,
          category: dto.category,
          userId: dto.userId,
        })
        await created.save()
        results.push({ indicatorKey: goal.indicatorKey, year: goal.year, status: 'created' })
      }
    }

    return {
      message: '목표값 저장 완료',
      results,
    }
  }
  //----------------------------------------------------------------------------------------------------

  // 카테고리 + 연도 기준으로 목표 조회
  async getGoalsByCategory(userId: string, category: string, year: number) {
    return this.esgGoalModel.find({ userId, category, year })
  }
  //----------------------------------------------------------------------------------------------------

  // 연도까지 포함해서 단일 목표 삭제
  async deleteGoal(userId: string, indicatorKey: string, category: string, year: number) {
    return this.esgGoalModel.deleteOne({ userId, indicatorKey, category, year })
  }
  //----------------------------------------------------------------------------------------------------
}
