import { IsString, IsNumber } from 'class-validator'

export class UpdateChartOrderBatchDto {
  @IsString()
  dashboardId: string

  @IsString()
  chartId: string

  @IsNumber()
  newOrder: number
}
