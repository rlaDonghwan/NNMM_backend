import { IsArray, IsString } from 'class-validator'

export class CreateEsgReportDto {
  @IsString() userId: string
  @IsString() companyName: string
  @IsString() category: 'social' | 'environmental' | 'governance'
  @IsString() chartConfigId: string
  @IsArray() years: number[]
  @IsArray() rows: any[]
}
