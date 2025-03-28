// src/esg/dto/create-esg.dto.ts
import { IsNotEmpty, IsString, IsArray, IsObject } from 'class-validator'

export class CreateESGDto {
  @IsNotEmpty()
  @IsString()
  userId: string

  @IsNotEmpty()
  @IsString()
  category: 'environmental' | 'social' | 'governance'

  @IsNotEmpty()
  @IsArray()
  years: number[]

  @IsNotEmpty()
  @IsArray()
  rows: {
    indicatorKey: string
    values: Record<number, string>
    color?: string
  }[]
}
