// src/esg/esg.service.ts
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { ESG, ESGDocument } from './schemas/esg.schema'
import { CreateEsgDto } from './esg.dto'
import mongoose from 'mongoose'

@Injectable()
export class ESGService {
  constructor(@InjectModel(ESG.name) private readonly esgModel: Model<ESGDocument>) {}

  // CreateEsgDto 타입을 받아서 Promise<ESG> 타입을 반환
  async create(createEsgDto: CreateEsgDto): Promise<ESG> {
    const created = new this.esgModel({
      ...createEsgDto,
      userId: new mongoose.Types.ObjectId(createEsgDto.userId),
      social: createEsgDto.social || {},
      governance: createEsgDto.governance || {},
    })
    return created.save()
  }
  //----------------------------------------------------------------------------------------------------
}
