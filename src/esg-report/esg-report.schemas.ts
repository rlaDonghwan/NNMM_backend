import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose' // Mongoose 데코레이터 및 팩토리
import { Document, Types } from 'mongoose' // Mongoose 타입 import

export type ESGReportDocument = ESGReport & Document // Document 타입 결합

@Schema({ _id: false }) // 서브스키마로 사용될 것이므로 _id 필드를 생성하지 않음
export class ESGRow {
  @Prop({ required: true }) indicatorKey: string // 지표 키
  @Prop({ type: Object, required: true }) values: Record<number, string> // 연도별 값
  @Prop() color?: string // 색상 (선택)
  @Prop() field1?: string // 대분류 (선택)
  @Prop() field2?: string // 중분류 (선택)
  @Prop() unit?: string // 단위 (선택)
}

@Schema({ timestamps: true }) // 생성일, 수정일 자동 저장
export class ESGReport {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true }) userId: Types.ObjectId // 사용자 ID 참조
  @Prop({ required: true }) companyName: string // 회사 이름
  @Prop({ required: true }) category: 'social' | 'environmental' | 'governance' // ESG 카테고리
  @Prop({ required: true }) chartConfigId: string // 차트 설정 ID
  @Prop({ required: true, type: [Number] }) years: number[] // 연도 배열
  @Prop({ type: [ESGRow], required: true }) rows: ESGRow[] // 입력 데이터 배열 (지표별 정보)
}

export const ESGReportSchema = SchemaFactory.createForClass(ESGReport) // 스키마 팩토리 생성
