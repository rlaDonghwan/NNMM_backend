// src/indicators/schemas/indicator.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

export type IndicatorDocument = Indicator & Document

@Schema({ timestamps: true })
export class Indicator {
  @Prop({ required: true })
  category: 'environmental' | 'social' | 'governance'

  @Prop({ required: true })
  group: string // ex: 직접에너지 사용량

  @Prop({ required: true, unique: true })
  key: string // ex: directEnergy.jetFuel

  @Prop({ required: true })
  label: string // ex: 항공유

  @Prop()
  unit: string // ex: TJ, tCO₂-eq

  @Prop({ default: true })
  isActive: boolean
}

export const IndicatorSchema = SchemaFactory.createForClass(Indicator)
