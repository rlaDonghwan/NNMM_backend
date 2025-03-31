import { Injectable } from '@nestjs/common' // NestJS의 Injectable 데코레이터를 가져옵니다. 이 클래스가 의존성 주입 가능한 서비스임을 나타냅니다.
import { InjectModel } from '@nestjs/mongoose' // Mongoose 모델을 주입하기 위한 데코레이터를 가져옵니다.
import { Model } from 'mongoose' // Mongoose의 Model 타입을 가져옵니다.
import { Indicator, IndicatorDocument } from './schemas/indicator.schema' // Indicator 스키마와 관련된 타입을 가져옵니다.

@Injectable() // 이 클래스가 NestJS의 의존성 주입 시스템에서 사용될 수 있도록 표시
export class IndicatorService {
  constructor(@InjectModel(Indicator.name) private indicatorModel: Model<IndicatorDocument>) {}
  // 생성자에서 Mongoose 모델을 주입받아 indicatorModel로 사용

  // 활성화된(isActive: true) 모든 Indicator를 조회
  async findAll(): Promise<Indicator[]> {
    return this.indicatorModel.find({ isActive: true }).exec()
    // Mongoose의 find 메서드를 사용하여 데이터를 조회하고, exec()로 실행
  }
  //----------------------------------------------------------------------------------------------------

  // 주어진 label 값을 가진 Indicator를 조회
  async findByLabel(label: string): Promise<Indicator | null> {
    return this.indicatorModel.findOne({ label }).exec()
    // Mongoose의 findOne 메서드를 사용하여 데이터를 조회하고, exec()로 실행
  }
  //----------------------------------------------------------------------------------------------------

  // 새로운 Indicator를 생성
  async create(data: Partial<Indicator>): Promise<Indicator> {
    const created = new this.indicatorModel(data) // 주어진 데이터를 기반으로 Mongoose 모델 인스턴스를 생성
    return created.save() // 생성된 인스턴스를 데이터베이스에 저장
  }
  //----------------------------------------------------------------------------------------------------

  // 주어진 category 값을 가진 활성화된 Indicator를 조회
  async findByCategory(category: string): Promise<Indicator[]> {
    return this.indicatorModel.find({ category, isActive: true }).exec()
  }
  //----------------------------------------------------------------------------------------------------

  async save(indicator: IndicatorDocument): Promise<Indicator> {
    return indicator.save()
  }
}
