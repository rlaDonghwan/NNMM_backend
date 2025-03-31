import { Injectable, ConflictException, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { ESG, ESGDocument } from './schemas/esg.schema'
import { CreateESGDto } from './esg.dto'
import mongoose from 'mongoose'
import { IndicatorService } from '@/indicator/indicator.service'
import { User, UserDocument } from '@/users/schemas/user.schema'

@Injectable()
export class ESGService {
  constructor(
    @InjectModel(ESG.name)
    private readonly esgModel: Model<ESGDocument>,
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
    private readonly indicatorService: IndicatorService,
  ) {}

  async createWithIndicatorCheck(createEsgDto: CreateESGDto): Promise<ESG> {
    console.log('✅ [ESGService] DTO 받음:', createEsgDto)

    const userObjectId = new mongoose.Types.ObjectId(createEsgDto.userId)

    const user = await this.userModel.findById(userObjectId)
    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.')
    }

    const year = createEsgDto.years?.[0]
    if (!year) {
      throw new ConflictException('연도 정보가 없습니다.')
    }

    // ✅ rows → category로 변환
    const converted = {}
    for (const row of createEsgDto.rows) {
      converted[row.indicatorKey] = {
        values: row.values,
      }
    }

    const environmental = createEsgDto.category === 'environmental' ? converted : {}
    const social = createEsgDto.category === 'social' ? converted : {}
    const governance = createEsgDto.category === 'governance' ? converted : {}

    // ✅ 중복 확인
    const exists = await this.esgModel.findOne({
      userId: userObjectId,
      companyName: user.companyName,
      year,
    })

    if (exists) {
      throw new ConflictException('이미 해당 회사/연도의 ESG 데이터가 존재합니다.')
    }

    // ✅ 인디케이터 존재 여부 확인
    await this.processIndicators('environmental', environmental)
    await this.processIndicators('social', social)
    await this.processIndicators('governance', governance)

    // ✅ 최종 저장
    const created = new this.esgModel({
      userId: userObjectId,
      companyName: user.companyName,
      year,
      environmental,
      social,
      governance,
    })

    console.log('📦 [ESGService] 최종 저장 데이터:', created)

    return created.save()
  }

  private async processIndicators(
    category: 'environmental' | 'social' | 'governance',
    indicators: any,
  ) {
    console.log(`📌 [Indicator] ${category} 항목 처리 시작`, Object.keys(indicators || {}))

    const labels = Object.keys(indicators || {})
    for (const label of labels) {
      const exists = await this.indicatorService.findByLabel(label)
      if (!exists) {
        await this.indicatorService.create({
          label,
          category,
          group: '기타',
          unit: '단위 없음',
        })
      }
    }
  }
}
