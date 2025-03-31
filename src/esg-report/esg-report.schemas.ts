import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'

export type ESGReportDocument = ESGReport & Document

@Schema({ _id: false }) // ✅ _id 제거
export class ESGRow {
  @Prop({ required: true })
  indicatorKey: string

  @Prop({ type: Object, required: true })
  values: Record<number, string>

  @Prop()
  color?: string

  @Prop()
  field1?: string

  @Prop()
  field2?: string

  @Prop()
  unit?: string
}

@Schema({ timestamps: true })
export class ESGReport {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId

  @Prop({ required: true })
  companyName: string

  @Prop({ required: true })
  category: 'social' | 'environmental' | 'governance'

  @Prop({ required: true })
  chartConfigId: string

  @Prop({ required: true, type: [Number] })
  years: number[]

  @Prop({ type: [ESGRow], required: true }) // ✅ 제대로 설정됨
  rows: ESGRow[]
}

export const ESGReportSchema = SchemaFactory.createForClass(ESGReport)
