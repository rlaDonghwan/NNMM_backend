import { Type } from 'class-transformer'
import { IsString, IsNumber } from 'class-validator'

export class UpdateChartOrderBatchDto {
  @IsString()
  dashboardId: string

  @IsString()
  chartId: string

  @Type(() => Number)
  @IsNumber()
  newOrder: number
}
