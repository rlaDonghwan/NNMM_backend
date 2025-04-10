import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'

export type EsgDashboardDocument = EsgDashboard & Document

@Schema({ _id: false })
export class EsgChartField {
  @Prop({ required: true }) key: string
  @Prop({ required: true }) label: string
  @Prop() field1?: string
  @Prop() field2?: string
  @Prop() color?: string
  @Prop({ type: Object, required: true }) data: Record<number, number>
  @Prop() unit?: string
}

@Schema({ _id: true })
export class EsgChart {
  set(arg0: string, newOrder: any) {
    throw new Error('Method not implemented.')
  }
  @Prop({ type: Types.ObjectId, default: () => new Types.ObjectId() })
  _id: Types.ObjectId
  @Prop({ required: true }) chartType: string
  @Prop({ required: true }) title: string
  @Prop({ required: true }) order: number
  @Prop({ required: true }) unit: string
  @Prop({ type: [Number], required: true }) years: number[]
  @Prop({ type: [EsgChartField], required: true }) fields: EsgChartField[]

  @Prop({ default: false }) isFavorite: boolean // Favorite기능 때문에 추가 했어용

  category: any
}

@Schema({ timestamps: true })
export class EsgDashboard {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true }) userId: Types.ObjectId
  @Prop({ required: true }) category: 'social' | 'environmental' | 'governance'
  @Prop({ type: [EsgChart], required: true }) charts: EsgChart[]
}

export const EsgDashboardSchema = SchemaFactory.createForClass(EsgDashboard)
