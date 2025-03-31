import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'

export type ChartDocument = Chart & Document

@Schema({ timestamps: true })
export class Chart {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId // User ID

  @Prop({ type: Types.ObjectId, ref: 'ESGReport', required: true })
  reportId: Types.ObjectId

  @Prop()
  companyName?: string // 회사 명

  @Prop()
  year?: number // 연도

  @Prop({ required: true })
  chartType: string //차트 종류 'bar', 'pie', 'line'

  @Prop({ type: [String], required: true })
  targetDataKeys: string[] // 지표 ['scope1', 'scope2', 'scope3']

  @Prop([String])
  colorSet?: string[] // 색상 값

  @Prop([String])
  labels?: string[] // 라벨 ['Scope 1', 'Scope 2']

  @Prop()
  order?: number // ex: 1, 2, 3
}

export const ChartSchema = SchemaFactory.createForClass(Chart)
