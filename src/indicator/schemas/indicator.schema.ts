// src/indicators/schemas/indicator.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

export type IndicatorDocument = Indicator & Document

@Schema({ timestamps: true })
export class Indicator {
  @Prop({ required: true })
  category: 'environmental' | 'social' | 'governance'

  @Prop({ required: true })
  group: string // 중분류

  @Prop({ required: true })
  label: string // 중분류

  @Prop({ required: true })
  unit: string //  단위

  @Prop({ default: true })
  isActive: boolean // 사용 여부
}

export const IndicatorSchema = SchemaFactory.createForClass(Indicator)
