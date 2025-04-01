// chart-config.service.ts
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Chart } from './chart-config.schema'
import { Model } from 'mongoose'
import mongoose from 'mongoose'
import { CreateChartDto } from './chart-config.dto'

@Injectable() // 이 클래스가 NestJS의 의존성 주입 시스템에서 제공자로 사용될 수 있도록 표시
export class ChartConfigService {
  constructor(
    @InjectModel(Chart.name) // Mongoose 모델을 의존성 주입으로 가져옴
    private readonly chartModel: Model<Chart>, // Chart 모델을 사용하기 위한 private 변수 선언
  ) {}
  //----------------------------------------------------------------------------------------------------

  async createChart(createChartDto: CreateChartDto & { userId: string }) {
    // 'years'와 'value'를 분리하여 각각 배열로 변환
    const years = createChartDto.years?.map((YearData) => YearData.years) ?? []
    const value = createChartDto.years?.map((YearData) => YearData.value) ?? []

    const created = new this.chartModel({
      userId: new mongoose.Types.ObjectId(createChartDto.userId), // userId를 ObjectId로 변환하여 저장
      chartType: createChartDto.chartType, // 차트 타입 설정
      targetDataKeys: createChartDto.targetDataKeys, // 대상 데이터 키 설정
      colorSet: createChartDto.colorSet ?? [], // 색상 세트를 설정하거나 기본값으로 빈 배열 설정
      labels: createChartDto.labels ?? createChartDto.targetDataKeys, // 레이블을 설정하거나 기본값으로 대상 데이터 키 설정
      years, // 'years' 배열 설정
      value, // 'value' 배열 설정
      units: createChartDto.units ?? [], // 단위를 설정하거나 기본값으로 빈 배열 설정
      order: createChartDto.order, // 차트의 순서 설정
      title: createChartDto.title, // 차트 제목 설정
      category: createChartDto.category, // 차트 카테고리 설정
    })

    return created.save() // 생성된 차트를 데이터베이스에 저장하고 반환
  }
  //----------------------------------------------------------------------------------------------------

  async findChartsByUser(userId: string) {
    // return this.chartModel.find({ userId }).exec()
    return this.chartModel.find({ userId }).sort({ order: 1 }).exec()
  }

  //차트 드래그앤 드롭으로 순서 바꿀 떄 쓸 수 있는 녀석
  // async updateChartOrder(orderedIds: string[]) {
  //   console.log('[updateChartOrder] saving order for:', orderedIds)
  //   const bulkOps = orderedIds.map((id, index) => ({
  //     updateOne: {
  //       filter: { _id: id },
  //       update: { $set: { order: index } },
  //     },
  //   }))
  //   return this.chartModel.bulkWrite(bulkOps)
  // }
  // async updateChartOrder(orderedIds: string[]) {
  //   console.log('🟡 [updateChartOrder] Saving order for:', orderedIds)
  //   const bulkOps = orderedIds.map((id, index) => ({
  //     updateOne: {
  //       filter: { _id: new mongoose.Types.ObjectId(id) },
  //       update: { $set: { order: index } },
  //     },
  //   }))

  //   try {
  //     const result = await this.chartModel.bulkWrite(bulkOps)
  //     console.log('🟢 bulkWrite result:', result)
  //     return result
  //   } catch (err) {
  //     console.error('❌ bulkWrite error:', err)
  //     throw err
  //   }
  // }
  async updateChartOrder(orderedIds: string[]) {
    console.log('🟡 [updateChartOrder] Saving order for:', orderedIds)

    const bulkOps = orderedIds.map((id, index) => ({
      updateOne: {
        filter: { _id: id }, // ✅ string 그대로 사용
        update: { $set: { order: index } },
      },
    }))

    console.log('🔧 bulkOps preview:', JSON.stringify(bulkOps, null, 2))

    try {
      const result = await this.chartModel.bulkWrite(bulkOps)
      console.log('🟢 bulkWrite result:', result)
      return result
    } catch (err) {
      console.error('❌ bulkWrite error:', err)
      throw err
    }
  }
}
