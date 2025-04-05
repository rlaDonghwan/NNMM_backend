import { IsNotEmpty, IsNumber, IsString } from 'class-validator'

export class CreateEsgGoalDto {
  @IsString()
  @IsNotEmpty()
  category: 'environmental' | 'social' | 'governance'

  @IsString()
  @IsNotEmpty()
  indicatorKey: string

  @IsNumber()
  targetValue: number

  @IsString()
  unit: string
}
