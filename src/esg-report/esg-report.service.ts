import { Injectable, NotFoundException } from '@nestjs/common' // Injectable, 예외 처리 import
import { InjectModel } from '@nestjs/mongoose' // 모델 주입을 위한 데코레이터
import { Model } from 'mongoose' // Mongoose 모델 타입
import { ESGReport, ESGReportDocument } from './esg-report.schemas' // ESGReport 관련 타입 import
import { CreateEsgReportDto } from './esg-report.dto' // DTO import
import { User, UserDocument } from '@/users/user.schema' // 사용자 스키마 import
import mongoose from 'mongoose' // ObjectId 생성 등

@Injectable() // 서비스로 등록
export class EsgReportService {
  constructor(
    @InjectModel(ESGReport.name)
    private readonly esgReportModel: Model<ESGReportDocument>, // ESGReport 모델 주입

    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>, // User 모델 주입
  ) {}

  async create(createDto: CreateEsgReportDto): Promise<ESGReport> {
    const userId = new mongoose.Types.ObjectId(createDto.userId) // 문자열 ID를 ObjectId로 변환
    const user = await this.userModel.findById(userId) // 사용자 조회
    if (!user) throw new NotFoundException('사용자를 찾을 수 없습니다.') // 사용자 없을 시 예외

    const created = new this.esgReportModel({
      ...createDto, // DTO 내용을 복사
      userId, // 사용자 ID 설정
      companyName: user.companyName, // 회사명은 DB에서 가져온 값 사용
    })

    return created.save() // MongoDB에 저장
  }

  async findByUser(userId: string): Promise<ESGReport[]> {
    return this.esgReportModel.find({ userId }).sort({ createdAt: -1 }) // 사용자별 보고서 목록 조회
  }

  async findOne(id: string): Promise<ESGReport> {
    const report = await this.esgReportModel.findById(id) // ID로 보고서 조회
    if (!report) {
      throw new NotFoundException('ESG 보고서를 찾을 수 없습니다.') // 없으면 예외 발생
    }
    return report // 보고서 반환
  }

  async delete(id: string): Promise<void> {
    await this.esgReportModel.findByIdAndDelete(id) // ID로 보고서 삭제
  }
}
