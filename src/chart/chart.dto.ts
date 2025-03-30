import { IsArray, IsOptional, IsString, IsNumber } from 'class-validator'

export class CreateChartDto {
  @IsOptional()
  @IsString()
  companyName?: string

  @IsOptional()
  @IsNumber()
  year?: number

  @IsString()
  chartType: string // 기본: 'bar'

  @IsArray()
  targetDataKeys: string[]

  @IsOptional()
  @IsArray()
  colorSet?: string[] // 기본: ['#3BAFDA']

  @IsOptional()
  @IsArray()
  labels?: string[] // targetDataKeys와 동일하게 fallback

  @IsOptional()
  @IsArray()
  years?: number[]

  @IsOptional()
  @IsNumber()
  order?: number
}

export class RecommendChartDto {
  @IsArray()
  targetDataKeys: string[]

  @IsOptional()
  @IsArray()
  years?: number[]
}
