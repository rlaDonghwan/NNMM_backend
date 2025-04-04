import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator'
import { Type } from 'class-transformer'

export class EsgChartFieldDto {
  @IsString() key: string
  @IsString() label: string
  @IsOptional() @IsString() field1?: string
  @IsOptional() @IsString() field2?: string
  @IsOptional() @IsString() color?: string
  @IsNotEmpty() data: Record<number, number>
}

export class EsgChartDto {
  @IsString() chartType: string
  @IsString() title: string
  @IsNumber() order: number
  @IsString() unit: string
  @IsArray() @IsNumber({}, { each: true }) years: number[]
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EsgChartFieldDto)
  fields: EsgChartFieldDto[]
}

export class CreateEsgDashboardDto {
  @IsEnum(['social', 'environmental', 'governance']) category:
    | 'social'
    | 'environmental'
    | 'governance'
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EsgChartDto)
  charts: EsgChartDto[]
}

export class UpdateEsgChartDto {
  @IsOptional() @IsString() title?: string
  @IsOptional() @IsString() unit?: string
  @IsOptional() @IsString() chartType?: string
  @IsOptional() @IsNumber() order?: number
  @IsOptional() isFavorite?: boolean
  @IsOptional() @IsArray() @IsNumber({}, { each: true }) years?: number[]

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => EsgChartFieldDto)
  fields?: EsgChartFieldDto[]
}
