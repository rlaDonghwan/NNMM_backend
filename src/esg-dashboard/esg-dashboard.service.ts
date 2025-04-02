import { Injectable } from '@nestjs/common' // 의존성 주입을 위한 Injectable 데코레이터 임포트
import { InjectModel } from '@nestjs/mongoose' // Mongoose 모델 주입을 위한 데코레이터 임포트
import { Model } from 'mongoose' // Mongoose의 Model 타입 임포트
import { EsgDashboard, EsgDashboardDocument } from './esg-dashboard.schema' // ESG 대시보드 스키마 및 타입 임포트
import { CreateEsgDashboardDto } from './esg-dashboard.dto' // 대시보드 생성 DTO 임포트

@Injectable() // 서비스 클래스로 선언 (의존성 주입 가능)
export class EsgDashboardService {
  constructor(
    @InjectModel(EsgDashboard.name) // EsgDashboard 모델을 주입
    private readonly esgDashboardModel: Model<EsgDashboardDocument>, // Mongoose 모델 타입으로 선언
  ) {}

  async create(userId: string, dto: CreateEsgDashboardDto) {
    // 새 ESG 대시보드 생성 (userId와 DTO 값 포함)
    const created = new this.esgDashboardModel({
      userId,
      ...dto,
    })
    return created.save() // MongoDB에 저장
  }

  async findByUser(userId: string) {
    // 해당 사용자(userId)의 모든 대시보드 조회 (lean()으로 plain object로 반환)
    const dashboards = await this.esgDashboardModel.find({ userId }).lean()

    // charts 배열을 펼쳐서(flatMap) 각 chart에 상위 속성(_id, category) 추가
    const flatCharts = dashboards.flatMap((d) => {
      return d.charts.map((chart) => ({
        ...chart,
        _id: d._id, // 대시보드 문서의 ID를 차트에 부여 (식별 목적)
        category: d.category, // 상위 category 정보도 차트에 포함
      }))
    })

    return flatCharts // 펼쳐진 차트 목록 반환
  }

  async findByUserAndCategory(userId: string, category: string) {
    // 사용자 ID와 카테고리를 기준으로 단일 대시보드 문서 조회
    return this.esgDashboardModel.findOne({ userId, category }).exec()
  }

  async deleteById(id: string) {
    // 특정 ID의 대시보드 삭제
    return this.esgDashboardModel.findByIdAndDelete(id).exec()
  }
}
