// chart-config.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'

export type ChartDocument = Chart & Document

@Schema({ timestamps: true })
export class Chart {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId // 사용자 ID

  @Prop({ type: Types.ObjectId, ref: 'ESGReport' })
  reportId: Types.ObjectId // 보고서 ID

  @Prop([{ years: Number, value: Number }]) // years 필드를 [{ years: number, value: number }] 형태로 수정
  years?: { years: number; value: number }[] // 연도 배열 (연도와 값 쌍으로 구성)

  @Prop({ required: true })
  chartType: string // 차트 유형

  @Prop({ type: [String], required: true })
  targetDataKeys: string[] // 타겟 데이터 키 배열

  @Prop([String])
  colorSet?: string[] // 색상 세트 배열

  @Prop([String])
  labels?: string[] // 라벨 배열

  @Prop({ type: Number, default: 0 }) // 선택적으로 순서를 저장
  order?: number // 순서

  @Prop([String])
  units?: string[] // 단위 배열

  @Prop()
  title?: string // 차트 제목

  @Prop({ required: true })
  category: string // 예: 'social', 'environmental', 'governance'
}

export const ChartConfigSchema = SchemaFactory.createForClass(Chart)
