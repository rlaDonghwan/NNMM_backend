import { IsArray, IsNotEmpty, IsNumber, IsString, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'

export class GoalItemDto {
  @IsString()
  @IsNotEmpty()
  indicatorKey: string

  @IsNumber()
  targetValue: number

  @IsNumber()
  currentValue: number // ✅ 현재까지의 진행량 추가

  @IsString()
  unit: string

  @IsNumber()
  year: number
}
export class CreateEsgGoalDto {
  @IsString()
  @IsNotEmpty()
  category: 'environmental' | 'social' | 'governance'

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => GoalItemDto)
  goals: GoalItemDto[]
}
