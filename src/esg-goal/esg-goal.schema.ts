import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

@Schema({ timestamps: true })
export class EsgGoal extends Document {
  @Prop({ required: true })
  userId: string

  @Prop({ required: true })
  category: 'environmental' | 'social' | 'governance'

  @Prop({ required: true })
  indicatorKey: string

  @Prop({ required: true })
  targetValue: number

  @Prop({ required: true }) // ✅ 현재 사용량도 필수로 받자
  currentValue: number

  @Prop()
  unit: string

  @Prop({ required: true }) // ➕ 목표 연도 필수
  year: number
}

export const EsgGoalSchema = SchemaFactory.createForClass(EsgGoal)
