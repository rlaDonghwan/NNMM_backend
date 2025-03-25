import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'

export type ChartDocument = Chart & Document

@Schema({ timestamps: true })
export class Chart {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId

  @Prop()
  companyName?: string

  @Prop()
  year?: number

  @Prop({ required: true })
  chartType: string // e.g. 'bar', 'pie', 'line'

  @Prop({ required: true })
  targetDataKey: string // e.g. 'environmental.energyUse'

  @Prop([String])
  colorSet?: string[]

  @Prop([String])
  labels?: string[]
}

export const ChartSchema = SchemaFactory.createForClass(Chart)
