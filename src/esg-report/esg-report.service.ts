import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { ESGReport, ESGReportDocument } from './esg-report.schemas'
import { CreateEsgReportDto } from './esg-report.dto'
import { User, UserDocument } from '@/users/schemas/user.schema'
import mongoose from 'mongoose'

@Injectable()
export class EsgReportService {
  constructor(
    @InjectModel(ESGReport.name)
    private readonly esgReportModel: Model<ESGReportDocument>,

    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  async create(createDto: CreateEsgReportDto): Promise<ESGReport> {
    const userId = new mongoose.Types.ObjectId(createDto.userId)
    const user = await this.userModel.findById(userId)
    if (!user) throw new NotFoundException('사용자를 찾을 수 없습니다.')

    const created = new this.esgReportModel({
      ...createDto,
      userId,
      companyName: user.companyName,
    })

    return created.save()
  }

  async findByUser(userId: string): Promise<ESGReport[]> {
    return this.esgReportModel.find({ userId }).sort({ createdAt: -1 })
  }

  async findOne(id: string): Promise<ESGReport> {
    const report = await this.esgReportModel.findById(id)
    if (!report) {
      throw new NotFoundException('ESG 보고서를 찾을 수 없습니다.')
    }
    return report
  }

  async delete(id: string): Promise<void> {
    await this.esgReportModel.findByIdAndDelete(id)
  }
}
