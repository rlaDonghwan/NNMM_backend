import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'

export type ESGDocument = ESG & Document

@Schema({ timestamps: true })
export class ESG {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId

  @Prop({ required: true })
  companyName: string

  @Prop({ required: true })
  year: number

  @Prop({ type: Object, required: true })
  environmental: any // Flexible structure

  @Prop({ type: Object, required: true })
  social: any

  @Prop({ type: Object, required: true })
  governance: any
}

export const ESGSchema = SchemaFactory.createForClass(ESG)
