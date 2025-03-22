import { Prop, Schema } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import { SchemaFactory } from '@nestjs/mongoose'

export type UserDocument = User & Document

@Schema()
export class User {
  @Prop({ required: true, unique: true })
  email: string

  @Prop({ required: true })
  name: string

  @Prop({ required: true })
  position: string

  @Prop({ required: true })
  password: string
}

export const UserSchema = SchemaFactory.createForClass(User)
