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

  @Prop({ type: [String], required: true })
  targetDataKeys: string[] // e.g. ['scope1', 'scope2', 'scope3']

  @Prop([String])
  colorSet?: string[]

  @Prop([String])
  labels?: string[] // ex: ['Scope 1', 'Scope 2']
}

export const ChartSchema = SchemaFactory.createForClass(Chart)
