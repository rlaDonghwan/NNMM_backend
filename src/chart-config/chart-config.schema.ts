// chart-config.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'

export type ChartDocument = Chart & Document

@Schema({ timestamps: true }) // timestamps 옵션을 활성화하여 생성 및 수정 시간을 자동으로 기록
export class Chart {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true }) // User 컬렉션의 ObjectId를 참조하며 필수 값
  userId: Types.ObjectId // 사용자 ID

  @Prop({ type: Types.ObjectId, ref: 'ESGReport' }) // ESGReport 컬렉션의 ObjectId를 참조
  reportId: Types.ObjectId // 보고서 ID

  @Prop([Number]) // 숫자 배열을 저장
  years?: number[] // 연도 배열

  @Prop({ required: true }) // 필수 값으로 차트 유형을 저장
  chartType: string // 차트 유형

  @Prop({ type: [String], required: true }) // 필수 값으로 문자열 배열을 저장
  targetDataKeys: string[] // 타겟 데이터 키 배열

  @Prop([String]) // 선택적으로 문자열 배열을 저장
  colorSet?: string[] // 색상 세트 배열

  @Prop([String]) // 선택적으로 문자열 배열을 저장
  labels?: string[] // 라벨 배열

  @Prop({ type: Number, default: 0 }) // 선택적으로 순서를 저장
  order?: number // 순서

  @Prop([String])
  units?: string[] // 선택 사항 (필요한 경우만)

  @Prop()
  title?: string // 차트 제목

  @Prop({ required: true })
  category: string // 예: 'social', 'environmental', 'governance'
}

export const ChartConfigSchema = SchemaFactory.createForClass(Chart)
