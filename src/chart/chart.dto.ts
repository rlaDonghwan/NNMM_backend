import { IsArray, IsOptional, IsString, IsNumber } from 'class-validator'

export class CreateChartDto {
  @IsString()
  userId: string
  @IsOptional()
  @IsString()
  companyName: string

  @IsOptional()
  @IsNumber()
  year: number

  @IsString()
  chartType: string

  @IsArray()
  targetDataKeys: string[]

  @IsOptional()
  @IsArray()
  colorSet: string[]

  @IsOptional()
  @IsArray()
  labels: string[]
}
