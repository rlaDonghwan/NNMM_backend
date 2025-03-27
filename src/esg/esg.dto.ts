// src/esg/dto/create-esg.dto.ts
import { IsNotEmpty, IsString, IsNumber, IsObject } from 'class-validator'

export class CreateEsgDto {
  @IsNotEmpty()
  @IsString()
  userId: string

  @IsNotEmpty()
  @IsString()
  companyName: string

  @IsNotEmpty()
  @IsNumber()
  year: number

  @IsNotEmpty()
  @IsObject()
  environmental: any

  @IsObject()
  social: any

  @IsObject()
  governance: any
}
